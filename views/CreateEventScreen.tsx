import { EventForm } from '@/components/EventForm';
import { useCreateEventViewModel } from '@/viewModels/useCreateEventViewModel';
import React from 'react';

export default function CreateEventScreen() {
  const {
    title,
    setTitle,
    destination,
    setDestination,
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    price,
    setPrice,
    seatsAvailable,
    setSeatsAvailable,
    requirePayment,
    setRequirePayment,
    loading,
    error,
    handleCreateEvent,
    navigateBack,
  } = useCreateEventViewModel();

  return (
    <EventForm
      title={title}
      setTitle={setTitle}
      destination={destination}
      setDestination={setDestination}
      pickupLocation={pickupLocation}
      setPickupLocation={setPickupLocation}
      pickupDate={pickupDate}
      setPickupDate={setPickupDate}
      pickupTime={pickupTime}
      setPickupTime={setPickupTime}
      price={price}
      setPrice={setPrice}
      seatsAvailable={seatsAvailable}
      setSeatsAvailable={setSeatsAvailable}
      requirePayment={requirePayment}
      setRequirePayment={setRequirePayment}
      loading={loading}
      error={error}
      onSubmit={handleCreateEvent}
      onBack={navigateBack}
      submitLabel="Create"
    />
  );
}