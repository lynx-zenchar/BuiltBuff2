// WorkoutLog.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import WorkoutLogList from './WorkoutLogList';
import WorkoutLogForm from './WorkoutLogForm';

const WorkoutLog = () => {
  return (
    <Routes>
      <Route path="/" element={<WorkoutLogList />} />
      <Route path="/new" element={<WorkoutLogForm mode="create" />} />
      <Route path=":id/edit" element={<WorkoutLogForm mode="edit" />} />
    </Routes>
  );
};

export default WorkoutLog;