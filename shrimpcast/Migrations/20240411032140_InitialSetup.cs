using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using shrimpcast.Data;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AutoModFilters",
                columns: table => new
                {
                    AutoModFilterId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutoModFilters", x => x.AutoModFilterId);
                });

            migrationBuilder.CreateTable(
                name: "Configuration",
                columns: table => new
                {
                    ConfigurationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChatEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    MaxConnectionsPerIP = table.Column<int>(type: "integer", nullable: false),
                    DefaultName = table.Column<string>(type: "text", nullable: false),
                    MaxMessagesToShow = table.Column<int>(type: "integer", nullable: false),
                    PrimaryStreamUrl = table.Column<string>(type: "text", nullable: true),
                    SecondaryStreamUrl = table.Column<string>(type: "text", nullable: true),
                    StreamEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    StreamTitle = table.Column<string>(type: "text", nullable: false),
                    StreamDescription = table.Column<string>(type: "text", nullable: false),
                    MessageDelayTime = table.Column<int>(type: "integer", nullable: false),
                    RequiredTokenTimeInMinutes = table.Column<int>(type: "integer", nullable: false),
                    OffsetDateTimeInMinutes = table.Column<int>(type: "integer", nullable: false),
                    ShowPoll = table.Column<bool>(type: "boolean", nullable: false),
                    AcceptNewOptions = table.Column<bool>(type: "boolean", nullable: false),
                    AcceptNewVotes = table.Column<bool>(type: "boolean", nullable: false),
                    PollTitle = table.Column<string>(type: "text", nullable: false),
                    MinSentToParticipate = table.Column<int>(type: "integer", nullable: false),
                    UseLegacyPlayer = table.Column<bool>(type: "boolean", nullable: false),
                    UsePrimarySource = table.Column<bool>(type: "boolean", nullable: false),
                    UseRTCEmbed = table.Column<bool>(type: "boolean", nullable: false),
                    MuteLenghtInMinutes = table.Column<int>(type: "integer", nullable: false),
                    EnableFireworks = table.Column<bool>(type: "boolean", nullable: false),
                    EnableChristmasTheme = table.Column<bool>(type: "boolean", nullable: false),
                    SnowflakeCount = table.Column<int>(type: "integer", nullable: false),
                    BlockTORConnections = table.Column<bool>(type: "boolean", nullable: false),
                    OBSHost = table.Column<string>(type: "text", nullable: true),
                    OBSPassword = table.Column<string>(type: "text", nullable: true),
                    OBSMainScene = table.Column<string>(type: "text", nullable: false),
                    OBSMainSource = table.Column<string>(type: "text", nullable: false),
                    OBSKinoSource = table.Column<string>(type: "text", nullable: false),
                    OBSMusicSource = table.Column<string>(type: "text", nullable: false),
                    OpenAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MinABTimeInMs = table.Column<int>(type: "integer", nullable: false),
                    MaxABTimeInMs = table.Column<int>(type: "integer", nullable: false),
                    VAPIDPublicKey = table.Column<string>(type: "text", nullable: true),
                    VAPIDPrivateKey = table.Column<string>(type: "text", nullable: true),
                    VAPIDMail = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configuration", x => x.ConfigurationId);
                });

            migrationBuilder.CreateTable(
                name: "Emote",
                columns: table => new
                {
                    EmoteId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emote", x => x.EmoteId);
                });

            migrationBuilder.CreateTable(
                name: "NameColour",
                columns: table => new
                {
                    NameColourId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ColourHex = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NameColour", x => x.NameColourId);
                });

            migrationBuilder.CreateTable(
                name: "Poll",
                columns: table => new
                {
                    PollId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poll", x => x.PollId);
                });

            migrationBuilder.CreateTable(
                name: "Session",
                columns: table => new
                {
                    SessionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionToken = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MutedUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsAdmin = table.Column<bool>(type: "boolean", nullable: false),
                    IsModerator = table.Column<bool>(type: "boolean", nullable: false),
                    UserDisplayColor = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Session", x => x.SessionId);
                });

            migrationBuilder.CreateTable(
                name: "TorExitNode",
                columns: table => new
                {
                    TorExitNodeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RemoteAddress = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TorExitNode", x => x.TorExitNodeId);
                });

            migrationBuilder.CreateTable(
                name: "Bans",
                columns: table => new
                {
                    BanId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    BannedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bans", x => x.BanId);
                    table.ForeignKey(
                        name: "FK_Bans_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Message",
                columns: table => new
                {
                    MessageId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RemoteAddress = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MessageType = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.MessageId);
                    table.ForeignKey(
                        name: "FK_Message_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    NotificationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    Endpoint = table.Column<string>(type: "text", nullable: false),
                    P256 = table.Column<string>(type: "text", nullable: false),
                    Auth = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.NotificationId);
                    table.ForeignKey(
                        name: "FK_Notification_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PollOption",
                columns: table => new
                {
                    PollOptionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PollId = table.Column<int>(type: "integer", nullable: false),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PollOption", x => x.PollOptionId);
                    table.ForeignKey(
                        name: "FK_PollOption_Poll_PollId",
                        column: x => x.PollId,
                        principalTable: "Poll",
                        principalColumn: "PollId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PollOption_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SessionIP",
                columns: table => new
                {
                    SessionIPId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    RemoteAddress = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionIP", x => x.SessionIPId);
                    table.ForeignKey(
                        name: "FK_SessionIP_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SessionName",
                columns: table => new
                {
                    SessionNameId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionName", x => x.SessionNameId);
                    table.ForeignKey(
                        name: "FK_SessionName_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PollVote",
                columns: table => new
                {
                    PollVoteId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PollOptionId = table.Column<int>(type: "integer", nullable: false),
                    SessionId = table.Column<int>(type: "integer", nullable: false),
                    RemoteAddress = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PollVote", x => x.PollVoteId);
                    table.ForeignKey(
                        name: "FK_PollVote_PollOption_PollOptionId",
                        column: x => x.PollOptionId,
                        principalTable: "PollOption",
                        principalColumn: "PollOptionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PollVote_Session_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Session",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutoModFilters_Content",
                table: "AutoModFilters",
                column: "Content");

            migrationBuilder.CreateIndex(
                name: "IX_Bans_SessionId",
                table: "Bans",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_CreatedAt",
                table: "Message",
                column: "CreatedAt",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_Message_SessionId",
                table: "Message",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_SessionId",
                table: "Notification",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_PollOption_PollId",
                table: "PollOption",
                column: "PollId");

            migrationBuilder.CreateIndex(
                name: "IX_PollOption_SessionId",
                table: "PollOption",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_PollVote_PollOptionId",
                table: "PollVote",
                column: "PollOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PollVote_SessionId",
                table: "PollVote",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Session_SessionId",
                table: "Session",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionIP_CreatedAt",
                table: "SessionIP",
                column: "CreatedAt",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_SessionIP_SessionId",
                table: "SessionIP",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionName_CreatedAt",
                table: "SessionName",
                column: "CreatedAt",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_SessionName_SessionId",
                table: "SessionName",
                column: "SessionId");

            DBInitialize.SetInitialData(migrationBuilder);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutoModFilters");

            migrationBuilder.DropTable(
                name: "Bans");

            migrationBuilder.DropTable(
                name: "Configuration");

            migrationBuilder.DropTable(
                name: "Emote");

            migrationBuilder.DropTable(
                name: "Message");

            migrationBuilder.DropTable(
                name: "NameColour");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "PollVote");

            migrationBuilder.DropTable(
                name: "SessionIP");

            migrationBuilder.DropTable(
                name: "SessionName");

            migrationBuilder.DropTable(
                name: "TorExitNode");

            migrationBuilder.DropTable(
                name: "PollOption");

            migrationBuilder.DropTable(
                name: "Poll");

            migrationBuilder.DropTable(
                name: "Session");
        }
    }
}
