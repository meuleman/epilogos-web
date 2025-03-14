import React from 'react';
import { useState, memo, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { AutoComplete } from 'antd';

import './GeneSearch.css';

import gencodeHg38Raw from "./gencode.hg38.json";
import gencodeHg19Raw from "./gencode.hg19.json";
import gencodeMm10Raw from "./gencode.mm10.json";

const genomicPositionRegex = /^chr(\d{1,2}|X|Y):(\d+)-(\d+)$/;
const genomicPositionRegex2 = /^chr(\d{1,2}|X|Y)(\s+)(\d+)(\s+)(\d+)$/;

// const gencode = gencodeRaw; // gencodeRaw.filter(d => d.type === "protein_coding");

const GeneSearch = memo(({
  mode,
  assembly,
  // onBlur = () => {},
  // onFocus = () => {},
  onSelect = () => {},
}) => {

  const autocompleteRef = useRef(null);

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
    } else if (genomicPositionRegex2.test(searchValue)) {
      return [
        {
          value: searchValue,
          label: `Genomic Position: ${searchValue}`,
          isGenomicPosition: true
        },
        ...geneOptions,
        // ...factorOptions
      ];
    }

    return geneOptions;
  }, [assembly, searchValue]);

  const handleSearch = (value) => {
    // console.log(`[GeneSearch.handleSearch] value ${value}`);
    setSearchValue(value);
    setInputValue(value);
  };

  const handleSelect = (value) => {
    // console.log(`[GeneSearch.handleSelect] value ${value}`);
    if (genomicPositionRegex.test(value)) {
      onSelect({
        value: value,
        chromosome: value.split(':')[0], 
        start: +value.split(':')[1].split('-')[0], 
        end: +value.split(':')[1].split('-')[1]
      });
      // setInputValue(value);
      setSearchValue('');
      setInputValue('');
      return;
    } else if (genomicPositionRegex2.test(value)) {
      let matches = genomicPositionRegex2.exec(value)
      onSelect({
        value: value,
        chromosome: "chr" + matches[1],
        start: +matches[3],
        end: +matches[5]
      });
      // setInputValue(value);
      setSearchValue('');
      setInputValue('');
      return;
    }
    const selectedOption = filteredOptions.find(option => option.value === value);
    // console.log("[GeneSearch.handleSelect] selectedOption", selectedOption);
    onSelect(selectedOption);
    setInputValue(selectedOption.label);
  };

  const handleOnDropdownVisibleChange = () => {
    setDropdownVisible(!dropdownVisible);
  }

  return (
    <div
      style={{
        cursor: (mode === 'qt') ? 'not-allowed' : 'default',
        pointerEvents: (mode === 'qt') ? 'none' : 'all',
      }}>
      <AutoComplete
        ref={autocompleteRef}
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
          cursor: (mode === 'qt') ? 'not-allowed' : 'default',
          pointerEvents: (mode === 'qt') ? 'none' : 'all',
        }}
        dropdownStyle={{
          cursor: (mode === 'qt') ? 'not-allowed' : 'default',
          pointerEvents: (mode === 'qt') ? 'none' : 'all',
          borderRadius: '1px',
          zIndex: '10000',
        }}
      />
    </div>
  )
})
GeneSearch.displayName = 'GeneSearch';
export default GeneSearch

GeneSearch.propTypes = {
  mode: PropTypes.string,
  assembly: PropTypes.string,
  onSelect: PropTypes.func,
}