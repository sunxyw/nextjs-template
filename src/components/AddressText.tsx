import type { SelectAddress } from '@/models/schema';

interface AddressTextProps {
  address: SelectAddress;
}

const AddressText = ({ address }: AddressTextProps) => {
  return JSON.stringify(address);
};

export default AddressText;
