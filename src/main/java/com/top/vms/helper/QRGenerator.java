package com.top.vms.helper;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.top.vms.configuration.Setup;
import com.top.vms.entity.Attachment;
import com.top.vms.repository.AttachmentRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

public class QRGenerator {

  private static String charset = "UTF-8";

    public static BufferedImage createQR(String data, int height, int width) throws WriterException, IOException {
        BitMatrix matrix = new MultiFormatWriter().encode(
                new String(data.getBytes(charset), charset),
                BarcodeFormat.QR_CODE, width, height);

        return MatrixToImageWriter.toBufferedImage(matrix);
    }

    public static Attachment createQRAsAttachment(String data, String fileName, Long entityId,String  entityType,
                                         int height, int width) throws WriterException, IOException {

        BitMatrix matrix = new MultiFormatWriter().encode(
                new String(data.getBytes(charset), charset),
                BarcodeFormat.QR_CODE, width, height);

        MatrixToImageWriter.writeToFile(
                matrix,
                fileName.substring(fileName.lastIndexOf('.') + 1),
                new File(Setup.getUploadPath()+"/"+fileName));
        Attachment attachment = new Attachment();
        attachment.setName(fileName);
        attachment.setPath(Setup.getUploadPath()+"/"+fileName);
        attachment.setType("QR");
        attachment.setEntityId(entityId);
        attachment.setEntityType(entityType);
        attachment = Setup.getApplicationContext().getBean(AttachmentRepository.class).save(attachment);
        return attachment;
    }

    public static String readQR(String fileName) throws FileNotFoundException, IOException, NotFoundException
       {
        BinaryBitmap binaryBitmap
                = new BinaryBitmap(new HybridBinarizer(
                new BufferedImageLuminanceSource(
                        ImageIO.read(
                                new FileInputStream(Setup.getUploadPath()+"/"+fileName)))));

        Result result
                = new MultiFormatReader().decode(binaryBitmap);

        return result.getText();
    }

}
