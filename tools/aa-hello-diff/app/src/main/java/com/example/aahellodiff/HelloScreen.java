package com.example.aahellodiff;

import androidx.annotation.NonNull;
import androidx.car.app.CarContext;
import androidx.car.app.Screen;
import androidx.car.app.model.MessageTemplate;
import androidx.car.app.model.Template;

public class HelloScreen extends Screen {
    public HelloScreen(@NonNull CarContext carContext) {
        super(carContext);
    }

    @NonNull
    @Override
    public Template onGetTemplate() {
        return new MessageTemplate.Builder(
                "Hello from the differential sample. If you see this on the car screen, projection works and the delta vs buzz2 is inside our APK.")
                .setTitle("AA Hello Diff")
                .build();
    }
}
