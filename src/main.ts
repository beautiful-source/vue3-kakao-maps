import "./assets/main.css";

import { createApp, type Component, type ComputedOptions, type MethodOptions } from "vue";
import App from "./App.vue";

const TypedAssertedApp = App as Component<any, any, any, ComputedOptions, MethodOptions, any, any>;
createApp(TypedAssertedApp).mount("#app");
