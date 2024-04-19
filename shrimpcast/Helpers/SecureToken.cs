using System.Security.Cryptography;

namespace shrimpcast.Helpers
{
    public class SecureToken
    {
        public static string GenerateTokenThreadSafe()
        {
            var tokenBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(tokenBytes);
            return UrlBase64Encode(tokenBytes);
        }

        private static string UrlBase64Encode(byte[] bytes)
        {
            var base64 = Convert.ToBase64String(bytes)
                                .TrimEnd('=')
                                .Replace('+', '-')
                                .Replace('/', '_');
            return base64;
        }
    }
}
