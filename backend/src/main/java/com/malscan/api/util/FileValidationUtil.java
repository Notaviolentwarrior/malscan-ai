package com.malscan.api.util;

import com.malscan.api.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.Set;

public class FileValidationUtil {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "exe", "dll", "pdf", "docx", "apk", "jar", "zip", "bin", "txt", "xml"
    );

    private FileValidationUtil() {
    }

    public static String validateAndSanitize(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Uploaded file is empty", HttpStatus.BAD_REQUEST);
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new ApiException("Uploaded file must have a valid filename", HttpStatus.BAD_REQUEST);
        }

        String cleanFilename = Paths.get(originalFilename).getFileName().toString();

        cleanFilename = cleanFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

        if (cleanFilename.length() > 180) {
            cleanFilename = cleanFilename.substring(cleanFilename.length() - 180);
        }

        String extension = getExtension(cleanFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ApiException(
                    "File type not allowed. Allowed extensions: " + ALLOWED_EXTENSIONS,
                    HttpStatus.BAD_REQUEST
            );
        }

        return cleanFilename;
    }

    private static String getExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");

        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            throw new ApiException("Uploaded file must have an extension", HttpStatus.BAD_REQUEST);
        }

        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}
