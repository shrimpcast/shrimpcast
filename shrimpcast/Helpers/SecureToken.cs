using shrimpcast.Entities;
using System.Security.Cryptography;
using System.Text;

namespace shrimpcast.Helpers
{
    public class SecureToken
    {
        public static SessionToken GenerateTokenThreadSafe()
        {
            var tokenBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(tokenBytes);
            var base64token = UrlBase64Encode(tokenBytes);
            return HashToken(base64token);
        }

        private static string UrlBase64Encode(byte[] bytes)
        {
            var base64 = Convert.ToBase64String(bytes)
                                .TrimEnd('=')
                                .Replace('+', '-')
                                .Replace('/', '_');
            return base64;
        }

        public static SessionToken HashToken (string token)
        {
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var hashedToken = Convert.ToHexString(SHA256.HashData(tokenBytes));
            return new SessionToken { Hash =  hashedToken, Plain = token }; 
        }

        public static bool AuthToken (string storedHash, string liveHash) =>
            CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(storedHash), Encoding.UTF8.GetBytes(liveHash));
    }
}
