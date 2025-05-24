"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const react_query_1 = require("react-query");
const Taxpayers_1 = __importDefault(require("./components/Taxpayers"));
const Inspectors_1 = __importDefault(require("./components/Inspectors"));
const Violations_1 = __importDefault(require("./components/Violations"));
const drawerWidth = 240;
const App = () => {
    const [mobileOpen, setMobileOpen] = (0, react_1.useState)(false);
    const [currentView, setCurrentView] = (0, react_1.useState)('taxpayers');
    const queryClient = new react_query_1.QueryClient();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const menuItems = [
        { text: 'Taxpayers', icon: <icons_material_1.People />, view: 'taxpayers' },
        { text: 'Inspectors', icon: <icons_material_1.Assignment />, view: 'inspectors' },
        { text: 'Violations', icon: <icons_material_1.Gavel />, view: 'violations' },
    ];
    const drawer = (<div>
      <material_1.Toolbar />
      <material_1.List>
        {menuItems.map((item) => (<material_1.ListItem button key={item.text} onClick={() => {
                setCurrentView(item.view);
                setMobileOpen(false);
            }} selected={currentView === item.view}>
            <material_1.ListItemIcon>{item.icon}</material_1.ListItemIcon>
            <material_1.ListItemText primary={item.text}/>
          </material_1.ListItem>))}
      </material_1.List>
    </div>);
    const renderContent = () => {
        switch (currentView) {
            case 'taxpayers':
                return <Taxpayers_1.default />;
            case 'inspectors':
                return <Inspectors_1.default />;
            case 'violations':
                return <Violations_1.default />;
            default:
                return <Taxpayers_1.default />;
        }
    };
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <material_1.Box sx={{ display: 'flex' }}>
        <material_1.CssBaseline />
        <material_1.AppBar position="fixed" sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
        }}>
          <material_1.Toolbar>
            <material_1.IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <icons_material_1.Menu />
            </material_1.IconButton>
            <material_1.Typography variant="h6" noWrap component="div">
              Tax System
            </material_1.Typography>
          </material_1.Toolbar>
        </material_1.AppBar>
        <material_1.Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <material_1.Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{
            keepMounted: true,
        }} sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
            },
        }}>
            {drawer}
          </material_1.Drawer>
          <material_1.Drawer variant="permanent" sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
            },
        }} open>
            {drawer}
          </material_1.Drawer>
        </material_1.Box>
        <material_1.Box component="main" sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
          <material_1.Toolbar />
          {renderContent()}
        </material_1.Box>
      </material_1.Box>
    </react_query_1.QueryClientProvider>);
};
exports.default = App;
//# sourceMappingURL=App.js.map