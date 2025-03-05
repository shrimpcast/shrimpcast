using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data
{
    public class APPContext(DbContextOptions<APPContext> options) : DbContext(options)
    {
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionName> SessionNames { get; set; }
        public DbSet<SessionIP> SessionIPs { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Ban> Bans { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<PollOption> PollOptions { get; set; }
        public DbSet<PollVote> PollVotes { get; set; }
        public DbSet<NameColour> NameColours { get; set; }
        public DbSet<TorExitNode> TorExitNodes { get; set; }
        public DbSet<AutoModFilter> AutoModFilters { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Emote> Emotes { get; set; }
        public DbSet<BingoOption> BingoOptions { get; set; }
        public DbSet<VpnAddress> VpnAddresses { get; set; }
        public DbSet<Source> Sources { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                                                         .AddJsonFile("appsettings.json")
                                                                         .Build();
            optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuild)
        {
            modelBuild.Entity<Session>().ToTable("Session");
            modelBuild.Entity<SessionName>().ToTable("SessionName");
            modelBuild.Entity<SessionIP>().ToTable("SessionIP");
            modelBuild.Entity<Configuration>().ToTable("Configuration");
            modelBuild.Entity<Message>().ToTable("Message");
            modelBuild.Entity<Ban>().ToTable("Bans");
            modelBuild.Entity<Poll>().ToTable("Poll");
            modelBuild.Entity<PollOption>().ToTable("PollOption");
            modelBuild.Entity<PollVote>().ToTable("PollVote");
            modelBuild.Entity<NameColour>().ToTable("NameColour");
            modelBuild.Entity<TorExitNode>().ToTable("TorExitNode");
            modelBuild.Entity<AutoModFilter>().ToTable("AutoModFilters");
            modelBuild.Entity<Notification>().ToTable("Notification");
            modelBuild.Entity<Emote>().ToTable("Emote");
            modelBuild.Entity<BingoOption>().ToTable("BingoOption");
            modelBuild.Entity<VpnAddress>().ToTable("VpnAddress");
            modelBuild.Entity<Source>().ToTable("Source");
        }
    }
}

