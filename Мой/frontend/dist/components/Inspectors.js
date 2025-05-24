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
const Inspectors = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [selectedInspector, setSelectedInspector] = (0, react_1.useState)(null);
    const [formData, setFormData] = (0, react_1.useState)({});
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: inspectors, isLoading } = (0, react_query_1.useQuery)('inspectors', async () => {
        const response = await axios_1.default.get('http://localhost:3000/api/inspectors');
        return response.data;
    });
    const createMutation = (0, react_query_1.useMutation)(async (newInspector) => {
        const response = await axios_1.default.post('http://localhost:3000/api/inspectors', newInspector);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('inspectors');
            handleClose();
        },
    });
    const updateMutation = (0, react_query_1.useMutation)(async (updatedInspector) => {
        const response = await axios_1.default.put(`http://localhost:3000/api/inspectors/${updatedInspector.inspectorid}`, updatedInspector);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('inspectors');
            handleClose();
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)(async (id) => {
        await axios_1.default.delete(`http://localhost:3000/api/inspectors/${id}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('inspectors');
        },
    });
    const handleOpen = (inspector) => {
        if (inspector) {
            setSelectedInspector(inspector);
            setFormData(inspector);
        }
        else {
            setSelectedInspector(null);
            setFormData({});
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedInspector(null);
        setFormData({});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedInspector) {
            updateMutation.mutate({ ...selectedInspector, ...formData });
        }
        else {
            createMutation.mutate(formData);
        }
    };
    const columns = [
        { field: 'inspectorid', headerName: 'ID', width: 70 },
        { field: 'lastname', headerName: 'Last Name', width: 130 },
        { field: 'firstname', headerName: 'First Name', width: 130 },
        { field: 'middlename', headerName: 'Middle Name', width: 130 },
        { field: 'position', headerName: 'Position', width: 150 },
        { field: 'hiredate', headerName: 'Hire Date', width: 130 },
        { field: 'accesslevel', headerName: 'Access Level', width: 130 },
        { field: 'departmentid', headerName: 'Department ID', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (<material_1.Box>
          <material_1.Button variant="contained" color="primary" size="small" onClick={() => handleOpen(params.row)} sx={{ mr: 1 }}>
            Edit
          </material_1.Button>
          <material_1.Button variant="contained" color="error" size="small" onClick={() => deleteMutation.mutate(params.row.inspectorid)}>
            Delete
          </material_1.Button>
        </material_1.Box>),
        },
    ];
    return (<material_1.Box sx={{ height: 600, width: '100%', p: 2 }}>
      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <material_1.Typography variant="h5">Inspectors</material_1.Typography>
        <material_1.Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Inspector
        </material_1.Button>
      </material_1.Box>

      <x_data_grid_1.DataGrid rows={inspectors || []} columns={columns} initialState={{
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
        }} pageSizeOptions={[10]} checkboxSelection disableRowSelectionOnClick loading={isLoading} getRowId={(row) => row.inspectorid}/>

      <material_1.Dialog open={open} onClose={handleClose}>
        <material_1.DialogTitle>
          {selectedInspector ? 'Edit Inspector' : 'Add New Inspector'}
        </material_1.DialogTitle>
        <form onSubmit={handleSubmit}>
          <material_1.DialogContent>
            <material_1.TextField fullWidth label="Last Name" value={formData.lastname || ''} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="First Name" value={formData.firstname || ''} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Middle Name" value={formData.middlename || ''} onChange={(e) => setFormData({ ...formData, middlename: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Position" value={formData.position || ''} onChange={(e) => setFormData({ ...formData, position: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Hire Date" type="date" value={formData.hiredate || ''} onChange={(e) => setFormData({ ...formData, hiredate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }}/>
            <material_1.TextField fullWidth label="Access Level" value={formData.accesslevel || ''} onChange={(e) => setFormData({ ...formData, accesslevel: e.target.value })} margin="normal"/>
            <material_1.TextField fullWidth label="Department ID" type="number" value={formData.departmentid || ''} onChange={(e) => setFormData({ ...formData, departmentid: Number(e.target.value) })} margin="normal"/>
          </material_1.DialogContent>
          <material_1.DialogActions>
            <material_1.Button onClick={handleClose}>Cancel</material_1.Button>
            <material_1.Button type="submit" variant="contained" color="primary">
              {selectedInspector ? 'Update' : 'Create'}
            </material_1.Button>
          </material_1.DialogActions>
        </form>
      </material_1.Dialog>
    </material_1.Box>);
};
exports.default = Inspectors;
//# sourceMappingURL=Inspectors.js.map