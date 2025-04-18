﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using shrimpcast.Data;

#nullable disable

namespace shrimpcast.Migrations
{
    [DbContext(typeof(APPContext))]
    [Migration("20250418183828_AddPassedTurnstileFieldSession")]
    partial class AddPassedTurnstileFieldSession
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("shrimpcast.Entities.DB.AutoModFilter", b =>
                {
                    b.Property<int>("AutoModFilterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AutoModFilterId"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("AutoModFilterId");

                    b.HasIndex("Content");

                    b.ToTable("AutoModFilters", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Ban", b =>
                {
                    b.Property<int>("BanId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("BanId"));

                    b.Property<int>("BannedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("BanId");

                    b.HasIndex("SessionId");

                    b.ToTable("Bans", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.BingoOption", b =>
                {
                    b.Property<int>("BingoOptionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("BingoOptionId"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsChecked")
                        .HasColumnType("boolean");

                    b.HasKey("BingoOptionId");

                    b.ToTable("BingoOption", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Configuration", b =>
                {
                    b.Property<int>("ConfigurationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ConfigurationId"));

                    b.Property<bool>("AcceptNewOptions")
                        .HasColumnType("boolean");

                    b.Property<bool>("AcceptNewVotes")
                        .HasColumnType("boolean");

                    b.Property<int>("AutoMarkingSecondsThreshold")
                        .HasColumnType("integer");

                    b.Property<int>("AutoMarkingUserCountThreshold")
                        .HasColumnType("integer");

                    b.Property<string>("BTCServerApiKey")
                        .HasColumnType("text");

                    b.Property<string>("BTCServerInstanceURL")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BTCServerStoreId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BTCServerWebhookSecret")
                        .HasColumnType("text");

                    b.Property<string>("BingoTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("ChatBlockTORConnections")
                        .HasColumnType("boolean");

                    b.Property<bool>("ChatBlockVPNConnections")
                        .HasColumnType("boolean");

                    b.Property<bool>("ChatEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("DefaultName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("EnableAutoBingoMarking")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableBTCServer")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableChristmasTheme")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableFireworks")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableHalloweenTheme")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableStripe")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableTurnstileMode")
                        .HasColumnType("boolean");

                    b.Property<bool>("EnableVerifiedMode")
                        .HasColumnType("boolean");

                    b.Property<string>("GoldenPassTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("GoldenPassValue")
                        .HasColumnType("integer");

                    b.Property<bool>("HideStreamTitle")
                        .HasColumnType("boolean");

                    b.Property<string>("IPServiceApiKey")
                        .HasColumnType("text");

                    b.Property<string>("IPServiceApiURL")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("MaxABTimeInMs")
                        .HasColumnType("integer");

                    b.Property<int>("MaxConnectedUsers")
                        .HasColumnType("integer");

                    b.Property<int>("MaxConnectionsPerIP")
                        .HasColumnType("integer");

                    b.Property<int>("MaxLengthTruncation")
                        .HasColumnType("integer");

                    b.Property<int>("MaxMessagesToShow")
                        .HasColumnType("integer");

                    b.Property<int>("MessageDelayTime")
                        .HasColumnType("integer");

                    b.Property<int>("MinABTimeInMs")
                        .HasColumnType("integer");

                    b.Property<int>("MinSentToParticipate")
                        .HasColumnType("integer");

                    b.Property<int>("MuteLenghtInMinutes")
                        .HasColumnType("integer");

                    b.Property<string>("OBSHost")
                        .HasColumnType("text");

                    b.Property<string>("OBSKinoSource")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OBSMainScene")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OBSMainSource")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OBSMusicSource")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OBSPassword")
                        .HasColumnType("text");

                    b.Property<int>("OffsetDateTimeInMinutes")
                        .HasColumnType("integer");

                    b.Property<DateTime>("OpenAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("OptionalApiKeyHeader")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PalettePrimary")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PaletteSecondary")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PollTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RequiredTokenTimeInMinutes")
                        .HasColumnType("integer");

                    b.Property<bool>("ShowBingo")
                        .HasColumnType("boolean");

                    b.Property<bool>("ShowGoldenPassButton")
                        .HasColumnType("boolean");

                    b.Property<bool>("ShowPoll")
                        .HasColumnType("boolean");

                    b.Property<bool>("ShowVotes")
                        .HasColumnType("boolean");

                    b.Property<bool>("SiteBlockTORConnections")
                        .HasColumnType("boolean");

                    b.Property<bool>("SiteBlockVPNConnections")
                        .HasColumnType("boolean");

                    b.Property<int>("SnowflakeCount")
                        .HasColumnType("integer");

                    b.Property<string>("StreamDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("StreamEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("StreamTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StripeSecretKey")
                        .HasColumnType("text");

                    b.Property<string>("StripeWebhookSecret")
                        .HasColumnType("text");

                    b.Property<string>("TurnstilePublicKey")
                        .HasColumnType("text");

                    b.Property<string>("TurnstileSecretKey")
                        .HasColumnType("text");

                    b.Property<bool>("UseDarkTheme")
                        .HasColumnType("boolean");

                    b.Property<string>("VAPIDMail")
                        .HasColumnType("text");

                    b.Property<string>("VAPIDPrivateKey")
                        .HasColumnType("text");

                    b.Property<string>("VAPIDPublicKey")
                        .HasColumnType("text");

                    b.Property<string>("VPNDetectionMatchCriteria")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ConfigurationId");

                    b.ToTable("Configuration", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Emote", b =>
                {
                    b.Property<int>("EmoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("EmoteId"));

                    b.Property<byte[]>("Content")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("EmoteId");

                    b.ToTable("Emote", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Message", b =>
                {
                    b.Property<int>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("MessageId"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("DeletedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("DeletedBy")
                        .HasColumnType("integer");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean");

                    b.Property<string>("MessageType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RemoteAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("MessageId");

                    b.HasIndex("CreatedAt")
                        .IsDescending();

                    b.HasIndex("SessionId");

                    b.ToTable("Message", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.NameColour", b =>
                {
                    b.Property<int>("NameColourId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("NameColourId"));

                    b.Property<string>("ColourHex")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("NameColourId");

                    b.ToTable("NameColour", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("NotificationId"));

                    b.Property<string>("Auth")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Endpoint")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("P256")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("NotificationId");

                    b.HasIndex("SessionId");

                    b.ToTable("Notification", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Poll", b =>
                {
                    b.Property<int>("PollId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PollId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("PollId");

                    b.ToTable("Poll", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.PollOption", b =>
                {
                    b.Property<int>("PollOptionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PollOptionId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<int>("PollId")
                        .HasColumnType("integer");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PollOptionId");

                    b.HasIndex("PollId");

                    b.HasIndex("SessionId");

                    b.ToTable("PollOption", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.PollVote", b =>
                {
                    b.Property<int>("PollVoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PollVoteId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("PollOptionId")
                        .HasColumnType("integer");

                    b.Property<string>("RemoteAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("PollVoteId");

                    b.HasIndex("PollOptionId");

                    b.HasIndex("SessionId");

                    b.ToTable("PollVote", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Session", b =>
                {
                    b.Property<int>("SessionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SessionId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsGolden")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsMod")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsVerified")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("MutedUntil")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("PassedTurnstile")
                        .HasColumnType("boolean");

                    b.Property<string>("SessionToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserDisplayColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("SessionId");

                    b.HasIndex("SessionId");

                    b.ToTable("Session", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.SessionIP", b =>
                {
                    b.Property<int>("SessionIPId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SessionIPId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("RemoteAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("SessionIPId");

                    b.HasIndex("CreatedAt")
                        .IsDescending();

                    b.HasIndex("SessionId");

                    b.ToTable("SessionIP", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.SessionName", b =>
                {
                    b.Property<int>("SessionNameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SessionNameId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<int>("SessionId")
                        .HasColumnType("integer");

                    b.HasKey("SessionNameId");

                    b.HasIndex("CreatedAt")
                        .IsDescending();

                    b.HasIndex("SessionId");

                    b.ToTable("SessionName", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Source", b =>
                {
                    b.Property<int>("SourceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SourceId"));

                    b.Property<int?>("ConfigurationId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("EndsAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("ResetOnScheduledSwitch")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("StartsAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Thumbnail")
                        .HasColumnType("text");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("UseLegacyPlayer")
                        .HasColumnType("boolean");

                    b.Property<bool>("UseRTCEmbed")
                        .HasColumnType("boolean");

                    b.HasKey("SourceId");

                    b.HasIndex("ConfigurationId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Source", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.TorExitNode", b =>
                {
                    b.Property<int>("TorExitNodeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TorExitNodeId"));

                    b.Property<string>("RemoteAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("TorExitNodeId");

                    b.ToTable("TorExitNode", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.VpnAddress", b =>
                {
                    b.Property<int>("VpnAddressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("VpnAddressId"));

                    b.Property<bool>("IsVPN")
                        .HasColumnType("boolean");

                    b.Property<string>("RemoteAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("VpnAddressId");

                    b.HasIndex("RemoteAddress")
                        .IsUnique();

                    b.ToTable("VpnAddress", (string)null);
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Ban", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Session", "Session")
                        .WithMany()
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Session");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Message", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Session", "Session")
                        .WithMany()
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Session");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Notification", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Session", "Session")
                        .WithMany()
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Session");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.PollOption", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Poll", "Poll")
                        .WithMany("Options")
                        .HasForeignKey("PollId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("shrimpcast.Entities.DB.Session", "Session")
                        .WithMany()
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Poll");

                    b.Navigation("Session");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.PollVote", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.PollOption", "PollOption")
                        .WithMany("Votes")
                        .HasForeignKey("PollOptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("shrimpcast.Entities.DB.Session", "Session")
                        .WithMany()
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PollOption");

                    b.Navigation("Session");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.SessionIP", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Session", null)
                        .WithMany("SessionIPs")
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.SessionName", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Session", null)
                        .WithMany("SessionNames")
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Source", b =>
                {
                    b.HasOne("shrimpcast.Entities.DB.Configuration", null)
                        .WithMany("Sources")
                        .HasForeignKey("ConfigurationId");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Configuration", b =>
                {
                    b.Navigation("Sources");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Poll", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.PollOption", b =>
                {
                    b.Navigation("Votes");
                });

            modelBuilder.Entity("shrimpcast.Entities.DB.Session", b =>
                {
                    b.Navigation("SessionIPs");

                    b.Navigation("SessionNames");
                });
#pragma warning restore 612, 618
        }
    }
}
