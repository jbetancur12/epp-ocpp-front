import { Delete, Edit, Info, Visibility, Add } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useGetChargerPointsQuery, addNewChargerStationMutation, useAddNewChargerStationMutation, useDeleteChargerStationMutation, useStartRemoteChargerStationMutation, useStopRemoteChargerStationMutation } from 'state/api';

const initialValues = { charger_box_id: '', connectors: "0" }



const ChargerPoints = () => {
    ;
  const theme = useTheme();
  const { data, isLoading } = useGetChargerPointsQuery();
  const [addNewChargerStation, response] = useAddNewChargerStationMutation();
  const [deleteChargerStation, responseDelete] = useDeleteChargerStationMutation()
  const [startRemoteCP, responseStartCP] = useStartRemoteChargerStationMutation();
  const [stopRemoteCP, responseStopCP] = useStopRemoteChargerStationMutation();
  
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [num, setNum] = useState();
  const [stations, setStations] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
      setOpen(false)
      setValues(initialValues)
};
  const handleChange = (e) => {
     
    if (e.target.name === 'connectors') {
      const regex = /^[0-9\b]+$/;
      if (e.target.value === '' || regex.test(e.target.value)) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleAdd = () => {
    addNewChargerStation(values).unwrap()
    .then(() => {
        handleClose()
    })
    .then((error) => {
      console.log(error)
    })
  };

  function getRealtimeData(data) {

  
    console.log("🚀 ~ file: index.jsx:65 ~ getRealtimeData ~ getStation", data)
    
    
    
}

  useEffect(() => {
    //const sse = new EventSource('http://192.168.0.6:3000/ocpp/chargerPoints/status')
    const sse = new EventSource('http://134.209.118.100/:3030/ocpp/chargerPoints/status')
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
        console.log('Error');

        sse.close();
    };
    return () => {
        sse.close();
    };
}, [])


  const columns = [
    {
      field: 'charger_box_id',
      headerName: 'Name',
      flex: 0.5,
    },
    {
      field: 'online',
      headerName: 'Online',
      flex: 0.5,
      renderCell: (params) => {

      }
    },
    {
      field: 'remoteCommands',
      headerName: 'Remote Commands',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const onClickRemoteStart = (e) => {
            e.stopPropagation(); // don't select this row after clicking
  
            const data = {
                id: `/${params.row.charger_box_id}`,
                connector: 1
            }

            startRemoteCP(data)
          };

          const onClickRemoteStop = (e) => {
            e.stopPropagation(); // don't select this row after clicking
  
            const data = {
                id: `/${params.row.charger_box_id}`,
                connector: 1
            }

            stopRemoteCP(data)
          };

        return (
          <ButtonGroup
            variant='contained'
            aria-label='outlined primary button group'
          >
            <Button color='success' style={{ textTransform: 'none' }} onClick={onClickRemoteStart}>
              Start
            </Button>
            <Button color='error' style={{ textTransform: 'none' }} onClick={onClickRemoteStop}>
              Stop
            </Button>
            <Button style={{ textTransform: 'none' }}>Spare</Button>
          </ButtonGroup>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          deleteChargerStation(params.id);
        };

        return (
          <ButtonGroup
            variant='contained'
            aria-label='outlined primary button group'
          >
            <IconButton>
              <Info />
            </IconButton>
            <IconButton>
              <Visibility />
            </IconButton>
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <Delete />
            </IconButton>
          </ButtonGroup>
        );
      },
    },
  ];
  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='Charger Stations' subtitle='List of Charger Stations' />

      <Box
        mt='40px'
        height='75vh'
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <Button onClick={handleOpen} variant='contained' startIcon={<Add />}>
          Add
        </Button>
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Charge Station</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name="charger_box_id"
              label='Name'
              type='text'
              fullWidth
              variant='standard'
              onChange={(e) => handleChange(e)}
              value={values.name}
            />
            <TextField
              type='text'
              margin='dense'
              id='connectors'
              name="connectors"
              label='Number Connectors'
              variant='standard'
              fullWidth
              onChange={(e) => handleChange(e)}
              value={values.connectors}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ChargerPoints;
