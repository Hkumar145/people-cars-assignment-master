import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PERSON_WITH_CARS } from './queries';
import './PersonDetail.css';


const PersonDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, { variables: { id } });

  if (loading) {
    return <p>Loading person details...</p>;
  }

  if (error) {
    return <p>Oops! Something went wrong: {error.message}</p>;
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
