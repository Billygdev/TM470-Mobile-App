import { EventForm } from '@/components/EventForm';
import { useEditEventViewModel } from '@/viewModels/useEditEventViewModel';
import React from 'react';

export default function EditEventScreen() {
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
    handleUpdateEvent,
    navigateBack,
    handleCancelEvent,
  } = useEditEventViewModel();

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
      onSubmit={handleUpdateEvent}
      onBack={navigateBack}
      submitLabel="Update"
      canCancel={true}
      onCancelEvent={handleCancelEvent}
    />
  );
}