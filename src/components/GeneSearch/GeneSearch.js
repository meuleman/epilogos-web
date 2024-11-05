import React from 'react';
import { useState, memo, useMemo, useRef } from 'react';

import { AutoComplete } from 'antd';

// import { gencode } from '../lib/Genes';
import gencodeHg38Raw from "./gencode.hg38.json";
import gencodeHg19Raw from "./gencode.hg19.json";
import gencodeMm10Raw from "./gencode.mm10.json";

const genomicPositionRegex = /^chr(\d{1,2}|X|Y):(\d+)-(\d+)$/;

// const gencode = gencodeRaw; // gencodeRaw.filter(d => d.type === "protein_coding");

const GeneSearch = memo(({
  assembly,
  // onBlur = () => {},
  // onFocus = () => {},
  onSelect = () => {},
}) => {

  const ref = useRef(null);

  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const filteredOptions = useMemo(() => {
    const gencode = (assembly === 'hg38') ? gencodeHg38Raw : ((assembly === 'hg19') ? gencodeHg19Raw : ((assembly === 'mm10') ? gencodeMm10Raw : []));
    const geneOptions = gencode.filter(g =>
      g.hgnc.toLowerCase().includes(searchValue.toLowerCase())
    ).map(g => ({
      value: g.hgnc,
      label: (
        <div>
          <div>{g.hgnc}</div>
          <div style={{ fontSize: '0.8em', color: '#888' }}>
            {`${g.chromosome}:${g.start}-${g.end} (${g.posneg})`}
          </div>
        </div>
      ),
      gene: g,
    }))

    // Add genomic position option if the input matches the regex
    if (genomicPositionRegex.test(searchValue)) {
      return [
        {
          value: searchValue,
          label: `Genomic Position: ${searchValue}`,
          isGenomicPosition: true
        },
        ...geneOptions
      ];
    }

    return geneOptions;
  }, [assembly, searchValue]);

  const handleSearch = (value) => {
    console.log(`handleSearch ${value}`);
    setSearchValue(value);
    setInputValue(value);
  };

  const handleSelect = (value) => {
    console.log(`handleSelect ${value}`);
    if (genomicPositionRegex.test(value)) {
      onSelect({
        value: value,
        chromosome: value.split(':')[0], 
        start: +value.split(':')[1].split('-')[0], 
        end: +value.split(':')[1].split('-')[1]
      });
      setInputValue(value);
      return;
    }
    const selectedOption = filteredOptions.find(option => option.value === value);
    console.log("gene", selectedOption);
    onSelect(selectedOption);
    setInputValue(selectedOption.label);
  };

  // const handleOnFocus = () => {
  //   onFocus();
  // }

  // const handleOnBlur = () => {
  //   onBlur();
  // }

  const handleOnDropdownVisibleChange = () => {
    setDropdownVisible(!dropdownVisible);
    // setTimeout(() => {
    //   console.log(`handleOnDropdownVisibleChange | dropdownVisible ${dropdownVisible} | inputValue [${inputValue}]`);
    //   if (!dropdownVisible && inputValue.length === 0) {
    //     console.log(`handleOnDropdownVisibleChange | blur`);
    //     ref.current.blur();
    //   }
    // }, 1500);
  }

  // const handleClear = () => {
  //   onSelect(null);
  //   setInputValue('');
  // };

  return (
    <div>
      <AutoComplete
        ref={ref}
        options={filteredOptions}
        value={inputValue}
        // onBlur={handleOnBlur}
        // onFocus={handleOnFocus}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onDropdownVisibleChange={handleOnDropdownVisibleChange}
        placeholder="Search for a gene or coordinate"
        style={{ 
          width: '230px',
          letterSpacing: '0.01px',
          borderRadius: '1px',
          zIndex: '10000',
        }}
        dropdownStyle={{
          borderRadius: '1px',
          zIndex: '10000',
        }}
      />
    </div>
  )
})
GeneSearch.displayName = 'GeneSearch';
export default GeneSearch
