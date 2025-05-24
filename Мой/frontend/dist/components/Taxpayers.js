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
const x_data_grid_1 = require("@mui/x-data-grid");
const react_query_1 = require("react-query");
const axios_1 = __importDefault(require("axios"));
const Taxpayers = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [selectedTaxpayer, setSelectedTaxpayer] = (0, react_1.useState)(null);
    const [formData, setFormData] = (0, react_1.useState)({});
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: taxpayers, isLoading } = (0, react_query_1.useQuery)('taxpayers', async () => {
        const response = await axios_1.default.get('http://localhost:3000/api/taxpayers');
        return response.data;
    });
    const createMutation = (0, react_query_1.useMutation)(async (newTaxpayer) => {
        const response = await axios_1.default.post('http://localhost:3000/api/taxpayers', newTaxpayer);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('taxpayers');
            handleClose();
        },
    });
    const updateMutation = (0, react_query_1.useMutation)(async (updatedTaxpayer) => {
        const response = await axios_1.default.put(`http://localhost:3000/api/taxpayers/${updatedTaxpayer.taxpayerid}`, updatedTaxpayer);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('taxpayers');
            handleClose();
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)(async (id) => {
        await axios_1.default.delete(`http://localhost:3000/api/taxpayers/${id}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('taxpayers');
        },
    });
    const handleOpen = (taxpayer) => {
        if (taxpayer) {
            setSelectedTaxpayer(taxpayer);
            setFormData(taxpayer);
        }
        else {
            setSelectedTaxpayer(null);
            setFormData({});
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedTaxpayer(null);
        setFormData({});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTaxpayer) {
            updateMutation.mutate({ ...selectedTaxpayer, ...formData });
        }
        else {
            createMutation.mutate(formData);
        }
    };
    const columns = [
        { field: 'taxpayerid', headerName: 'ID', width: 70 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'fullname', headerName: 'Full Name', width: 200 },
        { field: 'taxid', headerName: 'Tax ID', width: 130 },
        { field: 'registrationaddress', headerName: 'Address', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'registrationdate', headerName: 'Registration Date', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (<material_1.Box>
          <material_1.Button variant="contained" color="primary" size="small" onClick={() => handleOpen(params.row)} sx={{ mr: 1 }}>
            Edit
          </material_1.Button>
          <material_1.Button variant="contained" color="error" size="small" onClick={() => deleteMutation.mutate(params.row.taxpayerid)}>
            Delete
          </material_1.Button>
        </material_1.Box>),
        },
    ];
    return (<material_1.Box sx={{ height: 600, width: '100%', p: 2 }}>
      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <material_1.Typography variant="h5">Taxpayers</material_1.Typography>
        <material_1.Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Taxpayer
        </material_1.Button>
      </material_1.Box>

      <x_data_grid_1.DataGrid rows={taxpayers || []} columns={columns} initialState={{
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
        }} pageSizeOptions={[10]} checkboxSelection disableRowSelectionOnClick loading={isLoading} getRowId={(row) => row.taxpayerid}/>

      <material_1.Dialog open={open} onClose={handleClose}>
        <material_1.DialogTitle>
          {selectedTaxpayer ? 'Edit Taxpayer' : 'Add New Taxpayer'}
        </material_1.DialogTitle>
        <form onSubmit={handleSubmit}>
          <material_1.DialogContent>
            <material_1.TextField fullWidth label="Type" value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Full Name" value={formData.fullname || ''} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Tax ID" value={formData.taxid || ''} onChange={(e) => setFormData({ ...formData, taxid: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Registration Address" value={formData.registrationaddress || ''} onChange={(e) => setFormData({ ...formData, registrationaddress: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Registration Date" type="date" value={formData.registrationdate || ''} onChange={(e) => setFormData({ ...formData, registrationdate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }}/>
            <material_1.TextField fullWidth label="Department ID" type="number" value={formData.departmentid || ''} onChange={(e) => setFormData({ ...formData, departmentid: Number(e.target.value) })} margin="normal"/>
          </material_1.DialogContent>
          <material_1.DialogActions>
            <material_1.Button onClick={handleClose}>Cancel</material_1.Button>
            <material_1.Button type="submit" variant="contained" color="primary">
              {selectedTaxpayer ? 'Update' : 'Create'}
            </material_1.Button>
          </material_1.DialogActions>
        </form>
      </material_1.Dialog>
    </material_1.Box>);
};
exports.default = Taxpayers;
//# sourceMappingURL=Taxpayers.js.map