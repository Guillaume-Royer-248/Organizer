import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import './shiftsPage.scss';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import shiftService from '../../app/features/shiftHandling/shiftService';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { format } from "date-fns";
import { Select, MenuItem } from '@mui/material';
// import planningService from '../../app/features/planningHandling/PlanningService';
import Btn from '../../components/Btn/Btn';
import { NavLink } from 'react-router-dom';

const ShiftsPage = ({
    teamData,
    handleReload,
    planning
}) => {
    const [dayValue, setDayValue] = useState(new Date());
    const [selectedShift] = useState({});

    const handleChange = (newValue) => {
      setDayValue(newValue);
      findDayShift(newValue);
      handleReload();
    };

    

    const findDayShift = (day) => {
        if(planning){
            const searchedDay = planning.find((foundDay) => foundDay.date === format(new Date(day), 'yyyy-MM-dd'));
            if (searchedDay) {
                for (const team of searchedDay.teams) {
                    if(team.shift === 'M'){
                        selectedShift[team.teamId]= '1';
                    }
                    else if(team.shift === 'AM'){
                        selectedShift[team.teamId]= '2';
                    }
                    else if(team.shift === 'N'){
                        selectedShift[team.teamId]= '3';
                    } else {
                        selectedShift[team.teamId]= '4';
                    }
                }
            } else {
                handleReset()
            }
            selectedShift.name = 'test';
        }
    }

    const handleSelectChange = (event) => {
        selectedShift[event.target.name] = event.target.value;
        handleReload();
    }
    
    const handleReset = (event) => {
        for (const key in selectedShift){
            selectedShift[key] = '4';
        }
        handleReload();
    }

    const handleSubmit = () => {
        
        const body = {
            teams: []
        };
        body.date = format(new Date(dayValue), 'yyyy-MM-dd');
        for (const key in selectedShift){
            if(selectedShift[key] === '1'  && key !== 'name'){
                const team = key
                const shift = 'M';
                body.teams.push({
                    team_id: team,
                    shift: shift
                })
            }
            else if(selectedShift[key] === '2'  && key !== 'name'){
                const team = key
                const shift = 'AM';
                body.teams.push({
                    team_id: team,
                    shift: shift
                })
            }
            else if(selectedShift[key] === '3'  && key !== 'name'){
                const team = key
                const shift = 'N';
                body.teams.push({
                    team_id: team,
                    shift: shift
                })
            } else {
                if(key !== 'name'){
                    const team = key
                    const shift = '';
                    body.teams.push({
                        team_id: team,
                        shift: shift
                    }) 
                }
            }
        }
        const foundDay = planning.find((day) => day.date === body.date)
        if (foundDay){   
            shiftService.patchShift(body);
        } else {
            shiftService.postShift(body);
        }
    }

    return (
        <div className='shifts-page'>
            <div className='shifts-page__container'>

                <div className='shifts-page__calendar-container'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Date"
                          inputFormat="dd/MM/yyyy"
                          value={dayValue}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>
                </div>

                <form className='shifts-page__team-form'>
                    <div className='shifts-page__team-form-container'>
                        {selectedShift.name ? teamData.map((team) => (
                            <div className='shifts-page__team-container' key={team.id}>
                                <div className='shifts-page__team-name'>{team.team}</div>
                                <Select
                                    sx={{ width: 200, borderRadius: '3rem' }}
                                    labelId='demo-simple-select-label'
                                    id='demo-simple-select'
                                    onChange={handleSelectChange}
                                    name={team.id.toString()}
                                    label={team.team}
                                    value={selectedShift[team.id]}
                                >
                                    <MenuItem value='1'>M</MenuItem>
                                    <MenuItem value='2'>AM</MenuItem>
                                    <MenuItem value='3'>N</MenuItem>
                                    <MenuItem value='4'>Pas de faction</MenuItem>
                                </Select>
                            </div>
                        )) : findDayShift(dayValue)} 
                    </div> 
                    <div className='shifts-page__btns'>
                        <Btn text='Vider la faction' clicked={handleReset} />
                        <Btn text='Valider' clicked={handleSubmit}/>
                        <NavLink to='/planning'>
                            <Btn text='Retour'/>
                        </NavLink>
                    </div>              
                </form>
            </div>
        </div>
    )
}

ShiftsPage.propTypes = {}

export default ShiftsPage