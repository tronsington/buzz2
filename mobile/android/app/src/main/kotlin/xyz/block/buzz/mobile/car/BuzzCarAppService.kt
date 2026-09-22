package xyz.block.buzz.mobile.car

import android.content.Intent
import androidx.car.app.CarAppService
import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.Session
import androidx.car.app.SessionInfo
import androidx.car.app.model.Action
import androidx.car.app.model.ItemList
import androidx.car.app.model.ListTemplate
import androidx.car.app.model.Row
import androidx.car.app.model.Template
import androidx.car.app.validation.HostValidator

/**
 * buzz2 Android Auto spike (milestone zero).
 *
 * A minimal car-app service embedded in the Flutter host app. It renders a single
 * static [ListTemplate] so we can prove, on a real head unit, that:
 *  1. the car-app library coexists with the Flutter app in one APK,
 *  2. buzz2 shows up in the Android Auto app launcher (dev-mode sideload),
 *  3. templates render through projection.
 *
 * Host validation is deliberately permissive for sideload testing (Android Auto
 * "unknown sources"); a production build must validate host packages.
 */
class BuzzCarAppService : CarAppService() {
    override fun createHostValidator(): HostValidator {
        return HostValidator.ALLOW_ALL_HOSTS_VALIDATOR
    }

    override fun onCreateSession(sessionInfo: SessionInfo): Session {
        return BuzzCarSession()
    }
}

class BuzzCarSession : Session() {
    override fun onCreateScreen(intent: Intent): Screen {
        return HelloScreen(carContext)
    }
}

class HelloScreen(carContext: CarContext) : Screen(carContext) {
    override fun onGetTemplate(): Template {
        val list = ItemList.Builder()
            .addItem(
                Row.Builder()
                    .setTitle("buzz2 car spike")
                    .addText("Milestone zero: projection + launcher discovery")
                    .build(),
            )
            .build()
        return ListTemplate.Builder()
            .setTitle("buzz2")
            .setHeaderAction(Action.APP_ICON)
            .setSingleList(list)
            .build()
    }
}
