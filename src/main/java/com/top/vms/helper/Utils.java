package com.top.vms.helper;

import javax.xml.bind.DatatypeConverter;
import java.security.SecureRandom;

public class Utils {

    public static String genrateShortAccessKey() {

        SecureRandom random = new SecureRandom();
        byte bytes[] = new byte[24];
        random.nextBytes(bytes);
        String token = DatatypeConverter.printBase64Binary(bytes);

        token = token.replaceAll("[^a-zA-Z0-9]+", "");
        return token;
    }
}
