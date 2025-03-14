// ShowPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PERSON_WITH_CARS } from './queries';
import { Spin, Alert } from 'antd';
import './PersonDetail.css';

const PersonDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, { variables: { id } });

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  if (!data || !data.personWithCars) {
    return <Alert message="No data found" type="warning" showIcon />;
  }

  const { firstName, lastName, cars } = data.personWithCars;

  const renderCars = () => {
    return cars.map((car) => (
      <div key={car.id} className="car-detail">
        <p className="car-info">{car.year} {car.make} {car.model}</p>
        <p className="car-price">Price: ${car.price}</p>
      </div>
    ));
  };

  return (
    
    <section className="person-details">
      <Link to="/" className="go-back-link">GO BACK HOME</Link>
      <header>
        <h1>{firstName} {lastName}</h1>
      </header>
      <div className="cars-list">
        {renderCars()}
      </div>
    </section>
  );
};

export default PersonDetail;
