import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { getFormattedDate } from '@/utils/helpers/date';

type DatePickerHookReturnType = {
  date?: Date;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  renderDatePicker: () => React.ReactElement | null;
  formattedDate: string | null;
};

const useDatePicker = (initialDate = new Date()): DatePickerHookReturnType => {
  const [date, setDate] = useState<Date>(initialDate);
  const [formattedDate, setFormattedDate] = useState<string | null>(
    getFormattedDate(date)
  );
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const showDatePicker = (): void => setShowPicker(true);
  const hideDatePicker = (): void => setShowPicker(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    hideDatePicker();
    setDate(currentDate);
  };

  const renderDatePicker = (): React.ReactElement | null => {
    if (Platform.OS === 'ios' || showPicker) {
      return (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    setFormattedDate(getFormattedDate(date));
  }, [date]);

  return {
    date,
    showDatePicker,
    hideDatePicker,
    renderDatePicker,
    formattedDate,
  };
};

export default useDatePicker;
