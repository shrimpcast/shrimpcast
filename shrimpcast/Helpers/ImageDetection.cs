using System.Text;

namespace shrimpcast.Helpers
{
    public class ImageDetection
    {
        public enum ImageFormat
        {
            BMP,
            JPEG,
            GIF,
            TIFF,
            PNG,
        }

        public static ImageFormat GetImageFormat(byte[] byteArray)
        {
            // Define the number of bytes to check (first 4 bytes are sufficient for most formats).
            const int INT_SIZE = 4;

            // Define the known header bytes for each image format.
            // BMP files start with "BM"
            var bmp = Encoding.ASCII.GetBytes("BM");
            // GIF files start with "GIF"
            var gif = Encoding.ASCII.GetBytes("GIF");
            // PNG files have a specific signature: 137, 80, 78, 71
            var png = new byte[] { 137, 80, 78, 71 };
            // TIFF files may start with these byte sequences.
            var tiff = new byte[] { 73, 73, 42 };
            var tiff2 = new byte[] { 77, 77, 42 };
            // JPEG files can have two possible header sequences.
            var jpeg = new byte[] { 255, 216, 255, 224 };
            var jpeg2 = new byte[] { 255, 216, 255, 225 };

            // Copy the first 4 bytes from the input array into a buffer.
            var buffer = new byte[INT_SIZE];
            Buffer.BlockCopy(byteArray, 0, buffer, 0, INT_SIZE);

            // Check if the file's header matches the BMP signature.
            if (bmp.SequenceEqual(buffer.Take(bmp.Length)))
                return ImageFormat.BMP;

            // Check if the file's header matches the GIF signature.
            if (gif.SequenceEqual(buffer.Take(gif.Length)))
                return ImageFormat.GIF;

            // Check if the file's header matches the PNG signature.
            if (png.SequenceEqual(buffer.Take(png.Length)))
                return ImageFormat.PNG;

            // Check if the file's header matches the TIFF signature (little endian).
            if (tiff.SequenceEqual(buffer.Take(tiff.Length)))
                return ImageFormat.TIFF;

            // Check if the file's header matches the TIFF signature (big endian).
            if (tiff2.SequenceEqual(buffer.Take(tiff2.Length)))
                return ImageFormat.TIFF;

            // Check if the file's header matches the JPEG signature.
            if (jpeg.SequenceEqual(buffer.Take(jpeg.Length)))
                return ImageFormat.JPEG;

            // Check if the file's header matches the alternate JPEG signature.
            if (jpeg2.SequenceEqual(buffer.Take(jpeg2.Length)))
                return ImageFormat.JPEG;

            // If no known signature is detected, explode.
            throw new InvalidDataException("Invalid image");
        }
    }
}