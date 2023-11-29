package com.top.vms.helper;

import javax.xml.bind.DatatypeConverter;
import java.security.SecureRandom;
import java.util.regex.Pattern;

public class Utils {

    public static String genrateShortAccessKey() {

        SecureRandom random = new SecureRandom();
        byte bytes[] = new byte[24];
        random.nextBytes(bytes);
        String token = DatatypeConverter.printBase64Binary(bytes);

        token = token.replaceAll("[^a-zA-Z0-9]+", "");
        return token;
    }

    public static String replaceBetween(String input,
                                        String start, String end,
                                        boolean startInclusive,
                                        boolean endInclusive,
                                        String replaceWith) {
        start = Pattern.quote(start);
        end = Pattern.quote(end);
        return input.replaceAll("(" + start + ")" + ".*" + "(" + end + ")",
                (startInclusive ? "" : "$1") + replaceWith + (endInclusive ? "" : "$2"));
    }
}
