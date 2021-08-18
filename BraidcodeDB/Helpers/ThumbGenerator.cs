using System;
using System.IO;
using System.Drawing;
using System.Linq;
namespace BraidcodeDB.Helpers
{
    public class ThumbGenerator
    {
        private const int exifOrientationID = 0x112;
        public static void GenerateThumb(string ThumbPath, FileStream InputImg, int ThumbWidth)
        {
            Image CurrImg = Image.FromStream(InputImg);
            //CurrImg = RotateImageProperties(CurrImg);
            int X = CurrImg.Width;
            int Y = CurrImg.Height;
            int width = (int)((X * ThumbWidth) / Y);

            Image Thumb = CurrImg.GetThumbnailImage(width, ThumbWidth, () => false, IntPtr.Zero);
            Thumb = RotateImageProperties(Thumb);
            Thumb.Save(ThumbPath);
        }

        private static Image RotateImageProperties(Image CurrImg)
        {
            System.Drawing.Imaging.PropertyItem[] props = CurrImg.PropertyItems;
            if (Array.IndexOf(CurrImg.PropertyIdList, exifOrientationID) > -1)
            {
                int orientation;
                orientation = CurrImg.GetPropertyItem(exifOrientationID).Value[0];
                if (orientation >= 1 && orientation <= 8)
                {
                    switch (orientation)
                    {
                        case 2:
                            CurrImg.RotateFlip(RotateFlipType.RotateNoneFlipX);
                            break;
                        case 3:
                            CurrImg.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case 4:
                            CurrImg.RotateFlip(RotateFlipType.Rotate180FlipX);
                            break;
                        case 5:
                            CurrImg.RotateFlip(RotateFlipType.Rotate90FlipX);
                            break;
                        case 6:
                            CurrImg.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case 7:
                            CurrImg.RotateFlip(RotateFlipType.Rotate270FlipX);
                            break;
                        case 8:
                            CurrImg.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                    }
                    //CurrImg.RemovePropertyItem(exifOrientationID);
                }

            }
            return CurrImg;
        }
    }
}
