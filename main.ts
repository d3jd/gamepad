enum DIR {
    //% block="NONE"
    NONE = 0,
    //% block="U"
    U = 1,
    //% block="D"
    D = 2,
    //% block="L"
    L = 3,
    //% block="R"
    R = 4,
    //% block="U_L"
    U_L = 5,
    //% block="U_R"
    U_R = 6,
    //% block="D_L"
    D_L = 7,
    //% block="D_R"
    D_R = 8
}

enum KEY {
    P = 0,
    A = 1,
    B = 2,
    C = 3,
    D = 4,
    E = 5,
    F = 6,
}
let JoyStick_P = DigitalPin.P8;
let JoyStick_X = AnalogPin.P1;
let JoyStick_Y = AnalogPin.P2;
let KEY_A = DigitalPin.P5;
let KEY_B = DigitalPin.P11;
let KEY_C = DigitalPin.P15;
let KEY_D = DigitalPin.P14;
let KEY_E = DigitalPin.P13;
let KEY_F = DigitalPin.P12;

/**
 * gamepad extension
 */
//% weight=20 color=#ff8f3f icon="\uf11b"
namespace gamepad {
    let Read_X = 0, Read_Y = 0;

    //% blockId==init 
    //% block="initialize gamepad"
    //% weight=100
    export function init(): void {
        pins.setPull(JoyStick_P, PinPullMode.PullUp);
        pins.setPull(KEY_A, PinPullMode.PullUp);
        pins.setPull(KEY_B, PinPullMode.PullUp);
        pins.setPull(KEY_C, PinPullMode.PullUp);
        pins.setPull(KEY_D, PinPullMode.PullUp);
        pins.setPull(KEY_E, PinPullMode.PullUp);
        pins.setPull(KEY_F, PinPullMode.PullUp);

        //10 bits of AD conversion chip，max = 1024
        Read_X = pins.analogReadPin(JoyStick_X);
        Read_Y = pins.analogReadPin(JoyStick_Y);
    }

    //% blockId==is_button_pressed
    //% block="button %pin |pressed"
    //% weight=90
    export function isButtonPressed(pin: KEY): boolean {
        let Val = 2;

        //Read pin 
        if (pin == KEY.P) {
            Val = pins.digitalReadPin(JoyStick_P);
        } else if (pin == KEY.A) {
            Val = pins.digitalReadPin(KEY_A);
        } else if (pin == KEY.B) {
            Val = pins.digitalReadPin(KEY_B);
        } else if (pin == KEY.C) {
            Val = pins.digitalReadPin(KEY_C);
        } else if (pin == KEY.D) {
            Val = pins.digitalReadPin(KEY_D);
        } else if (pin == KEY.E) {
            Val = pins.digitalReadPin(KEY_E);
        } else {
            Val = pins.digitalReadPin(KEY_F);
        }

        //registerWithDal((int)pin, MICROBIT_KEY_EVT_CLICK, body);
        //To determine the value
        if (Val == 0) {
            return true;
        } else {
            return false;
        }
    }

    //% blockId==on_button_pressed 
    //% block="on button %pin |pressed"
    //% weight=80
    export function onButtonPressed(pin: KEY, body: Action): void {
        let Pin = 0;

        //Read pin 
        if (pin == KEY.P) {
            Pin = JoyStick_P;
        } else if (pin == KEY.A) {
            Pin = KEY_A;
        } else if (pin == KEY.B) {
            Pin = KEY_B;
        } else if (pin == KEY.C) {
            Pin = KEY_C;
        } else if (pin == KEY.D) {
            Pin = KEY_D;
        } else if (pin == KEY.E) {
            Pin = KEY_E;
        } else {
            Pin = KEY_F;
        }
        pins.onPulsed(Pin, PulseValue.Low, body);
    }

    //% blockId==Listen_Dir
    //% block="joystick direction %pin "
    //% weight=70
    export function listenDirection(Dir: DIR): boolean {
        let Get_Dir = DIR.NONE;

        let New_X = pins.analogReadPin(AnalogPin.P1);
        let New_Y = pins.analogReadPin(AnalogPin.P2);

        let Right = New_X - Read_X;
        let Left = Read_X - New_X;
        let Up = New_Y - Read_Y;
        let Down = Read_Y - New_Y;

        let Dx = Math.abs(Read_X - New_X);
        let Dy = Math.abs(New_Y - Read_Y);

        let Precision = 150; //0.5v

        if (Right > Precision && Dy < Precision) {
            Get_Dir = DIR.R;
        } else if (Left > Precision && Dy < Precision) {
            Get_Dir = DIR.L;
        } else if (Up > Precision && Dx < Precision) {
            Get_Dir = DIR.U;
        } else if (Down > Precision && Dx < Precision) {
            Get_Dir = DIR.D;
        } else if (Right > Precision && Up > Precision) {
            Get_Dir = DIR.U_R;
        } else if (Right > Precision && Down > Precision) {
            Get_Dir = DIR.D_R;
        } else if (Left > Precision && Up > Precision) {
            Get_Dir = DIR.U_L;
        } else if (Left > Precision && Down > Precision) {
            Get_Dir = DIR.D_L;
        } else {
            Get_Dir = DIR.NONE;
        }

        //To determine the value
        if (Get_Dir == Dir) {
            return true;
        } else {
            return false;
        }
    }

}
