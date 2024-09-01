import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = {
  USD: { symbol: '$', name: 'USD' },
  EUR: { symbol: '€', name: 'EUR' },
  CAD: { symbol: 'C$', name: 'CAD' },
};

const BillSplitter = () => {
  const [totalBill, setTotalBill] = useState(0);
  const [numPeople, setNumPeople] = useState(2);
  const [percentages, setPercentages] = useState([50, 50]);
  const [amounts, setAmounts] = useState([0, 0]);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const newPercentages = Array(numPeople).fill(100 / numPeople);
    setPercentages(newPercentages);
  }, [numPeople]);

  useEffect(() => {
    const newAmounts = percentages.map(percentage => (totalBill * percentage) / 100);
    setAmounts(newAmounts);
  }, [totalBill, percentages]);

  const handlePercentageChange = (index, newValue) => {
    const newPercentages = [...percentages];
    newPercentages[index] = newValue[0];
    
    const sum = newPercentages.reduce((a, b) => a + b, 0);
    if (sum > 100) {
      const diff = sum - 100;
      for (let i = 0; i < newPercentages.length; i++) {
        if (i !== index) {
          newPercentages[i] = Math.max(0, newPercentages[i] - diff / (numPeople - 1));
        }
      }
    }
    
    setPercentages(newPercentages);
  };

  const splitEqually = () => {
    const equalPercentage = 100 / numPeople;
    setPercentages(Array(numPeople).fill(equalPercentage));
  };

  const formatCurrency = (amount) => {
    return `${currencies[currency].symbol}${amount.toFixed(2)}`;
  };

  const addPerson = () => {
    const newNumPeople = numPeople + 1;
    setNumPeople(newNumPeople);
    const newPercentage = 100 / newNumPeople;
    setPercentages(prev => [...prev.map(p => p * (newNumPeople - 1) / newNumPeople), newPercentage]);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Séparateur de Facture de Restaurant</h1>
      <div className="mb-4">
        <label className="block mb-2">Montant total de la facture :</label>
        <Input
          type="number"
          value={totalBill}
          onChange={(e) => setTotalBill(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Nombre de personnes : {numPeople}</label>
        <Button onClick={addPerson} className="w-full mb-2">Ajouter une personne</Button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Devise :</label>
        <Select onValueChange={setCurrency} defaultValue={currency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une devise" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(currencies).map(([code, { name }]) => (
              <SelectItem key={code} value={code}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={splitEqually} className="mb-4 w-full">Répartir équitablement</Button>
      {percentages.map((percentage, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-2">
            Personne {index + 1} ({percentage.toFixed(2)}%) : {formatCurrency(amounts[index])}
          </label>
          <Slider
            value={[percentage]}
            onValueChange={(newValue) => handlePercentageChange(index, newValue)}
            max={100}
            step={1}
          />
        </div>
      ))}
    </div>
  );
};

export default BillSplitter;