package com.milkdelivery.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessException(

            BusinessException ex,

            HttpServletRequest request

    ) {

        return new ErrorResponse(

                LocalDateTime.now(),

                HttpStatus.BAD_REQUEST.value(),

                HttpStatus.BAD_REQUEST.getReasonPhrase(),

                ex.getMessage(),

                request.getRequestURI()

        );

    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(

            Exception ex,

            HttpServletRequest request

    ) {

        return new ErrorResponse(

                LocalDateTime.now(),

                HttpStatus.INTERNAL_SERVER_ERROR.value(),

                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),

                ex.getMessage(),

                request.getRequestURI()

        );

    }

}