import React, { Component, Fragment } from "react";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

class Autocomplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      // Selected annotation location
      selectedSuggestionLocation: "",
      // Debounce timeout interval (ms)
      debounceTimeout: 100,
      // Minimum length before lookup
      minimumLength: 2
    };
  }
  
  componentDidMount() {
    setTimeout(() => { document.getElementById("autocomplete-input").focus() }, 500);
  }
  
  clearUserInput = () => {
    this.setState({ userInput: "" });
  }

  onChange = e => {    
    if (!e.target || (e.target.value.length === 0)) return;
    //console.log("onChange", e.target.value);
    //if ((this.state.userInput.startsWith("chr")) && ((this.state.userInput.indexOf(":") !== -1) || (this.state.userInput.indexOf('\t') !== -1))) {
    if ((e.target.value.startsWith("chr")) && ((e.target.value.indexOf(":") !== -1) || (e.target.value.indexOf('\t') !== -1) || (e.target.value.indexOf('\s') !== -1))) {  
      this.setState({
        showSuggestions: false,
        userInput: e.target.value
      }, () => {
        console.log("calling this.props.onChangeInput", this.state.userInput);
        this.props.onChangeInput(this.state.userInput);
      })
      return;
    }
    const queryAnnotationHost = () => {
      let annotationUrl = this.props.annotationScheme + "://" + this.props.annotationHost + ":" + this.props.annotationPort + "/sets?q=" + this.state.userInput + "&assembly=" + this.props.annotationAssembly;
      //console.log("annotationUrl", annotationUrl);
      axios.get(annotationUrl)
        .then((res) => {
          if (res.data.hits) {
            //console.log("(autocomplete) res.data.hits", res.data.hits);
            let hitNames = Object.keys(res.data.hits);
            let hitObjects = [];
            hitNames.forEach((hitName) => {
              let hitArray = res.data.hits[hitName];
              hitArray.forEach((withinHitObj) => {
                withinHitObj['location'] = withinHitObj['chrom'] + ":" + withinHitObj['start'] + "-" + withinHitObj['stop'];
                hitObjects.push(withinHitObj);
              });
            });
            //console.log("hitObjects", hitObjects);
            const filteredSuggestions = hitObjects;
            this.setState({
              activeSuggestion: 0,
              filteredSuggestions,
              showSuggestions: true
            });
          }
        })
        .catch((err) => {
          //console.log("Error", err);
        });
    }

    this.setState({ userInput: e.target.value }, 
    () => { 
      queryAnnotationHost();
      this.props.onChangeInput(this.state.userInput);
    });
    
  };

  onClick = e => {
    document.activeElement.blur();
    let selectedSuggestionName = e.currentTarget.getElementsByClassName("suggestion-name")[0].innerText;
    let selectedSuggestionLocation = e.currentTarget.getElementsByClassName("suggestion-location")[0].innerText;
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: selectedSuggestionName,
      selectedSuggestionLocation: selectedSuggestionLocation
    }, 
    () => { 
      this.props.onChangeLocation(this.state.selectedSuggestionLocation, true);
      this.clearUserInput();
    });
  };

  onKeyDown = e => {
    const { activeSuggestion } = this.state;
    
    //console.log("e.keyCode", e.keyCode);

    // Enter
    if (e.keyCode === 13) {
      document.activeElement.blur();
      setTimeout(() => {
        let colonDashTest = this.state.userInput.startsWith("chr") && (this.state.userInput.indexOf(":") !== -1);
        let whitespaceTest = this.state.userInput.startsWith("chr") && (/^[\S]+(\s+[\S]+)*$/.test(this.state.userInput));
        if (colonDashTest || whitespaceTest) {
          let newUserInput = "";
          let newLocation = this.state.userInput;
          this.setState({
            activeSuggestion: 0,
            showSuggestions: false,
            userInput: newUserInput,
            selectedSuggestionLocation: newLocation
          }, () => { 
            //console.log(`Autocomplete > this.state.userInput ${this.state.userInput}`);
            //console.log(`Autocomplete > this.state.selectedSuggestionLocation ${this.state.selectedSuggestionLocation}`);
            this.props.onChangeLocation(this.state.selectedSuggestionLocation, false);
            this.clearUserInput();
          });
          return;
        }
        //console.log("filteredSuggestions[activeSuggestion]", JSON.stringify(this.state.filteredSuggestions[this.state.activeSuggestion]));
        let newUserInput = "";
        let newLocation = "";
        if (typeof this.state.filteredSuggestions[this.state.activeSuggestion] !== "undefined") {
          newUserInput = this.state.filteredSuggestions[this.state.activeSuggestion].name;
          newLocation = this.state.filteredSuggestions[this.state.activeSuggestion].location
        }
        else {
          newUserInput = this.state.userInput;
          newLocation = this.state.userInput;
        }
        //console.log("newLocation", newLocation);
        this.setState({
          activeSuggestion: 0,
          showSuggestions: false,
          userInput: newUserInput,
          selectedSuggestionLocation: newLocation
        }, () => { 
          this.props.onChangeLocation(this.state.selectedSuggestionLocation, true);
          this.clearUserInput();
        });
      }, this.state.debounceTimeout);
    }
    
    // Up arrow
    else if (e.keyCode === 38) {
      if (this.state.activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 }, () => { 
        //console.log("scrolling to suggestion:", this.state.activeSuggestion);
        this.scrollToActiveSuggestion() 
      });
    }
    
    // Down arrow
    else if (e.keyCode === 40) {
      if ((this.state.activeSuggestion + 1) === this.state.filteredSuggestions.length) {
        return;
      }
      else {
        this.setState({ activeSuggestion: this.state.activeSuggestion + 1 }, () => { 
          //console.log("scrolling to suggestion:", this.state.activeSuggestion); 
          this.scrollToActiveSuggestion() 
        });
      }
    }
  };
  
  scrollToActiveSuggestion = () => {
    let element = document.getElementById("suggestion-" + this.state.activeSuggestion);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end', 
        inline: 'nearest'
      });
    }
  }

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className={this.props.suggestionsClassName} style={(this.props.maxSuggestionHeight)?{maxHeight:`${this.props.maxSuggestionHeight}px`}:{}}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} onClick={onClick} key={index} id={"suggestion-" + index}>
                  <div>
                    <span className="suggestion-name">{suggestion.name}</span><br />
                    <span className="suggestion-description">{suggestion.description}</span><br />
                    <span className="suggestion-location">{suggestion.location}</span> <span className="suggestion-strand">({suggestion.strand})</span>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions"></div>
        );
      }
    }

    return (
      <Fragment>
        <DebounceInput
          id="autocomplete-input"
          minLength={this.state.minimumLength}
          debounceTimeout={this.state.debounceTimeout}
          className={ `${ this.props.className }` }
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={this.props.onFocus}
          value={userInput}
          placeholder={ `${ this.props.placeholder }` }
          autoComplete="off"
          title={this.props.title}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;