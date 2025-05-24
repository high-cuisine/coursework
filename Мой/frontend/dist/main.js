"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const material_1 = require("@mui/material");
const CssBaseline_1 = __importDefault(require("@mui/material/CssBaseline"));
const App_1 = __importDefault(require("./App"));
const theme = (0, material_1.createTheme)({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});
client_1.default.createRoot(document.getElementById('root')).render(<react_1.default.StrictMode>
    <material_1.ThemeProvider theme={theme}>
      <CssBaseline_1.default />
      <App_1.default />
    </material_1.ThemeProvider>
  </react_1.default.StrictMode>);
//# sourceMappingURL=main.js.map