import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, Button, Form, Input, Select, message, Modal } from 'antd';
import { ADD_PERSON, ADD_CAR, GET_PEOPLE, GET_CARS, DELETE_PERSON, DELETE_CAR, UPDATE_PERSON } from '../queries';
import EditCarModal from './PersonCard';
import './../home.css';

const { Option } = Select;

const Home = () => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE);
  const { data: carsData } = useQuery(GET_CARS);

  const [addPerson] = useMutation(ADD_PERSON);
  const [addCar] = useMutation(ADD_CAR);
  const [deletePerson] = useMutation(DELETE_PERSON);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [isPersonEditModalVisible, setPersonEditModalVisible] = useState(false);
  const [isCarEditModalVisible, setCarEditModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [editPersonForm] = Form.useForm();
  const [addPersonForm] = Form.useForm();
  const [addCarForm] = Form.useForm();

  const handleMutation = async (mutationFn, variables, successMessage, errorMessage, refetchQueries) => {
    try {
      await mutationFn({ variables, refetchQueries });
      message.success(successMessage);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error(errorMessage);
    }
  };

  const handleCreatePerson = (values) => {
    const { firstName, lastName } = values;
    handleMutation(addPerson, { firstName, lastName }, 'Person added successfully!', 'Failed to add person!', [{ query: GET_PEOPLE }]);
    addPersonForm.resetFields();
  };

  const handleCreateCar = (values) => {
    const { year, make, model, price, personId } = values;
    handleMutation(addCar, { year: parseInt(year, 10), make, model, price: parseFloat(price), personId }, 'Car added successfully!', 'Failed to add car!', [{ query: GET_CARS }]);
    addCarForm.resetFields();
  };

  const handleRemovePerson = (personId) => {
    handleMutation(deletePerson, { id: personId }, 'Person removed successfully!', 'Failed to remove person!', [{ query: GET_PEOPLE }]);
  };

  const handleRemoveCar = (carId) => {
    handleMutation(deleteCar, { id: carId }, 'Car removed successfully!', 'Failed to remove car!', [{ query: GET_CARS }]);
  };

  const handleEditPerson = (person) => {
    setSelectedPerson(person);
    editPersonForm.setFieldsValue({ firstName: person.firstName, lastName: person.lastName });
    setPersonEditModalVisible(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setCarEditModalVisible(true);
  };

  const handleUpdatePerson = (values) => {
    handleMutation(updatePerson, { id: selectedPerson.id, firstName: values.firstName, lastName: values.lastName }, 'Person updated successfully!', 'Failed to update person!', [{ query: GET_PEOPLE }]);
    setPersonEditModalVisible(false);
  };

  return (
    <div className="home-container">
    <div className="main-container">  
      <section className="section">
      <h2>Add New Person</h2>
      <Form form={addPersonForm} onFinish={handleCreatePerson}>
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">Add Person</Button>
      </Form>
    </section>
  
    <section className="add-sections">
      <div className="section">
        <h2>Add new Car</h2>
        {peopleData?.people?.length > 0 && (
          <Form form={addCarForm} onFinish={handleCreateCar}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="make" label="Make" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="model" label="Model" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="personId" label="Person" rules={[{ required: true }]}>
              <Select>
                {peopleData?.people?.map((person) => (
                  <Option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Add Car</Button>
          </Form>
        )}
      </div>
    </section></div>
  
  
    <section className="section">
      <h2>People List</h2>
      {peopleLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {peopleData?.people?.map((person) => (
            <Card key={person.id} title={`${person.firstName} ${person.lastName}`}>
              {carsData?.cars
                .filter((car) => car.personId === person.id)
                .map((car) => (
                  <Card type="inner" key={car.id} title={`${car.year} ${car.make} ${car.model}`}>
                    <p>Price: ${car.price}</p>
                    <Button type="primary" onClick={() => handleRemoveCar(car.id)}>Remove Car</Button>
                    <Button type="default" onClick={() => handleEditCar(car)}>Edit Car</Button>
                  </Card>
                ))}
              <Button type="danger" onClick={() => handleRemovePerson(person.id)}>Remove Person</Button>
              <Button onClick={() => handleEditPerson(person)}>Edit Person</Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  
    {isCarEditModalVisible && selectedCar && (
      <EditCarModal car={selectedCar} setIsEditModalVisible={setCarEditModalVisible} />
    )}
  
    <Modal
      title="Edit Person"
      visible={isPersonEditModalVisible}
      onCancel={() => setPersonEditModalVisible(false)}
      footer={null}
    >
      <Form form={editPersonForm} onFinish={handleUpdatePerson}>
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Update Person</Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
  
  );
};

export default Home;
