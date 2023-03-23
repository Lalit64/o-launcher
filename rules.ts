import * as fs from 'fs'
import { KarabinerRules, Manipulator } from "./types";

let trigger_key = 'grave_accent_and_tilde';

const generate_launcher_mode = (from_keycode: string, mandatory_modifiers: [], application: string) => {
    let a: Manipulator = {
        description: `${application}`,
        type: "basic",
        from: {
            simultaneous: [
                // Trigger key is basically the modifier key that you want I use ` (tilde) but you can change it above.
                {
                    key_code: trigger_key
                },
                // This is the key code for example 'g' for 'Google Chrome'
                {
                    key_code: from_keycode
                }
            ],
            simultaneous_options: {
                key_down_order: 'strict',
                key_up_order: 'strict_inverse',
                to_after_key_up: [
                    {
                        set_variable: {
                            name: 'launcher_mode',
                            value: 0
                        }
                    }
                ]
            },
            "modifiers": {
                mandatory: mandatory_modifiers,
                optional: [
                    "any"
                ]
            }
        },
        to: [
            {
                set_variable: {
                    name: 'launcher_mode',
                    value: 1
                }
            },
            // The shell command for opening/switching to the application
            {
                "shell_command": `open -a '${application}.app'`
            }
        ],
        "parameters": {
            "basic.simultaneous_threshold_milliseconds": 500
        }
    }

    return a;
}

const rules: KarabinerRules[] = [
    {
        description: "O-Launcher",
        // For 'application' provide only the name don't add .app
        manipulators: [
            generate_launcher_mode('a', [], 'Arc'),
            generate_launcher_mode('f', [], 'Finder'),
            generate_launcher_mode('t', [], 'iTerm'),
            generate_launcher_mode('z', [], 'Zoom.us'),
            generate_launcher_mode('c', [], 'Visual\ Studio\ Code'),
        ]
    },
]

fs.writeFileSync(
    "../../../karabiner.json",
    JSON.stringify(
        {
            global: {
                ask_for_confirmation_before_quitting: true,
                check_for_updates_on_startup: true,
                show_in_menu_bar: true,
                show_profile_name_in_menu_bar: false,
                unsafe_ui: false
            },
            profiles: [
                {
                    name: "Default",
                    complex_modifications: {
                        rules,
                    },
                },
            ],
        },
        null,
        2
    )
);