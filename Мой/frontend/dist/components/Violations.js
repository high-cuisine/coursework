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
const Violations = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [selectedViolation, setSelectedViolation] = (0, react_1.useState)(null);
    const [formData, setFormData] = (0, react_1.useState)({});
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: violations, isLoading } = (0, react_query_1.useQuery)('violations', async () => {
        const response = await axios_1.default.get('http://localhost:3000/api/violations');
        return response.data;
    });
    const createMutation = (0, react_query_1.useMutation)(async (newViolation) => {
        const response = await axios_1.default.post('http://localhost:3000/api/violations', newViolation);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('violations');
            handleClose();
        },
    });
    const updateMutation = (0, react_query_1.useMutation)(async (updatedViolation) => {
        const response = await axios_1.default.put(`http://localhost:3000/api/violations/${updatedViolation.violationid}`, updatedViolation);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('violations');
            handleClose();
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)(async (id) => {
        await axios_1.default.delete(`http://localhost:3000/api/violations/${id}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('violations');
        },
    });
    const handleOpen = (violation) => {
        if (violation) {
            setSelectedViolation(violation);
            setFormData(violation);
        }
        else {
            setSelectedViolation(null);
            setFormData({});
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedViolation(null);
        setFormData({});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedViolation) {
            updateMutation.mutate({ ...selectedViolation, ...formData });
        }
        else {
            createMutation.mutate(formData);
        }
    };
    const columns = [
        { field: 'violationid', headerName: 'ID', width: 70 },
        { field: 'taxpayerid', headerName: 'Taxpayer ID', width: 100 },
        { field: 'inspectorid', headerName: 'Inspector ID', width: 100 },
        { field: 'violationdate', headerName: 'Violation Date', width: 130 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'fineamount', headerName: 'Fine Amount', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'paymentduedate', headerName: 'Payment Due Date', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (<material_1.Box>
          <material_1.Button variant="contained" color="primary" size="small" onClick={() => handleOpen(params.row)} sx={{ mr: 1 }}>
            Edit
          </material_1.Button>
          <material_1.Button variant="contained" color="error" size="small" onClick={() => deleteMutation.mutate(params.row.violationid)}>
            Delete
          </material_1.Button>
        </material_1.Box>),
        },
    ];
    return (<material_1.Box sx={{ height: 600, width: '100%', p: 2 }}>
      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <material_1.Typography variant="h5">Violations</material_1.Typography>
        <material_1.Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Violation
        </material_1.Button>
      </material_1.Box>

      <x_data_grid_1.DataGrid rows={violations || []} columns={columns} initialState={{
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
        }} pageSizeOptions={[10]} checkboxSelection disableRowSelectionOnClick loading={isLoading} getRowId={(row) => row.violationid}/>

      <material_1.Dialog open={open} onClose={handleClose}>
        <material_1.DialogTitle>
          {selectedViolation ? 'Edit Violation' : 'Add New Violation'}
        </material_1.DialogTitle>
        <form onSubmit={handleSubmit}>
          <material_1.DialogContent>
            <material_1.TextField fullWidth label="Taxpayer ID" type="number" value={formData.taxpayerid || ''} onChange={(e) => setFormData({ ...formData, taxpayerid: Number(e.target.value) })} margin="normal"/>
            <material_1.TextField fullWidth label="Inspector ID" type="number" value={formData.inspectorid || ''} onChange={(e) => setFormData({ ...formData, inspectorid: Number(e.target.value) })} margin="normal"/>
            <material_1.TextField fullWidth label="Violation Date" type="date" value={formData.violationdate || ''} onChange={(e) => setFormData({ ...formData, violationdate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }}/>
            <material_1.TextField fullWidth label="Description" multiline rows={4} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Fine Amount" type="number" value={formData.fineamount || ''} onChange={(e) => setFormData({ ...formData, fineamount: Number(e.target.value) })} margin="normal"/>
            <material_1.TextField fullWidth label="Status" value={formData.status || ''} onChange={(e) => setFormData({ ...formData, status: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Payment Due Date" type="date" value={formData.paymentduedate || ''} onChange={(e) => setFormData({ ...formData, paymentduedate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }}/>
          </material_1.DialogContent>
          <material_1.DialogActions>
            <material_1.Button onClick={handleClose}>Cancel</material_1.Button>
            <material_1.Button type="submit" variant="contained" color="primary">
              {selectedViolation ? 'Update' : 'Create'}
            </material_1.Button>
          </material_1.DialogActions>
        </form>
      </material_1.Dialog>
    </material_1.Box>);
};
exports.default = Violations;
//# sourceMappingURL=Violations.js.map