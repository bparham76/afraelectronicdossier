import { useParams } from 'react-router-dom';

const EditUser = () => {
	const { id } = useParams();
	return <div>EditUser {id}</div>;
};

export default EditUser;
