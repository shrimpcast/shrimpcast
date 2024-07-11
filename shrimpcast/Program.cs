using Hangfire;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using shrimpcast.Data;
using shrimpcast.Data.Repositories;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSystemd();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureEndpointDefaults(listenOptions =>
    {
    });
});
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<APPContext>(options =>
  options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddSignalR(hubOptions =>
{
    hubOptions.EnableDetailedErrors = true;
    hubOptions.MaximumParallelInvocationsPerClient = 2;
});
builder.Services.AddSingleton(typeof(Connections<>));
builder.Services.AddSingleton(typeof(Pings<>));
builder.Services.AddSingleton(typeof(ConfigurationSingleton));
builder.Services.AddScoped<IConfigurationRepository, ConfigurationRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IBanRepository, BanRepository>();
builder.Services.AddScoped<IPollRepository, PollRepository>();
builder.Services.AddScoped<INameColourRepository, NameColourRepository>();
builder.Services.AddScoped<ITorExitNodeRepository, TorExitNodeRepository>();
builder.Services.AddScoped<IOBSCommandsRepository, OBSCommandsRepository>();
builder.Services.AddScoped<IAutoModFilterRepository, AutoModFilterRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IEmoteRepository, EmoteRepository>();
builder.Services.AddScoped<IBingoRepository, BingoRepository>();
builder.Services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings());
builder.Services.AddHangfireServer();
GlobalConfiguration.Configuration.UseInMemoryStorage();
var app = builder.Build();
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Initialize DB
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<APPContext>();
    DBInitialize.Initialize(context);
    var configuration = services.GetRequiredService<ConfigurationSingleton>();
    await configuration.Initialize();
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
});

app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.UseCors(builder =>
{
    builder
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .WithMethods("GET", "POST");
});

app.MapHub<SiteHub>("/hubs/ws");
app.MapFallbackToFile("index.html");
app.Run();
