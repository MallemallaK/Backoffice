import * as React from 'react';
//import styles from './Suot.module.scss';
import type { ISuotProps } from './ISuotProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/lists/web";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs"
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'
//import 'office-ui-fabric-react/dist/css/fabric.css';
//import TimePicker from 'react-time-picker';
import {Dropdown, IDropdownOption, Modal, PrimaryButton, TextField } from '@fluentui/react';
import { SearchBox } from '@fluentui/react/lib/SearchBox'
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { SlEye } from "react-icons/sl";
import DataTable, { TableColumn } from 'react-data-table-component';
// import {
 
//     Tab,
//     TabList,
  
//   } from "@fluentui/react-components";

//import { DateConvention, DateTimePicker } from '@pnp/spfx-controls-react';
//import { DateTimePicker, DateConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';


// import {
 
//     Tab,
//     TabList,
  
//   } from "@fluentui/react-components";

//import { DateConvention, DateTimePicker } from '@pnp/spfx-controls-react';
import { DateTimePicker, DateConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';




const busrailOptions = [
    { key: 'Bus', text: 'Bus' },
    { key: 'Rail', text: 'Rail' }
    //{ key: 'All', text: 'All' }
  ];

  export interface IMyComponentState {
    busrailDropdownOptions: IDropdownOption[];
    // qualificationsDropdownOptions: IDropdownOption[];
    selectedbusrailDropdownKey: string | number | undefined;
    selectedBusrailType: string | undefined;
    // selectedQualification: string | undefined;
  }
const fetchUserData = async (badgeNumber: string) => {
    const apiUrl = `https://apit.metro.net/ws/rest/fis/ext/v1/metro-employee-info/?badgeNumber=${badgeNumber}`;
    const apiKey = '9d51334f-77ad-44a5-b534-0591753e0c58';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

export default class Suot extends React.Component<any, any> {

    constructor(props: ISuotProps, state: any) {

        super(props);
        this.state = {
            badge: '',
            firstName: '',
            lastName: '',
            email: '',
            groupName:false,
            selectedTab:'Reports',
            setSelectedTab:'',
            content:'',
            searchValue:'',
            searchQuery:'',
            otData:[],
            busrailDropdownOptions: busrailOptions,
            overtimeType:'',
            effectiveDate: null,
            showPopup:false
           
  
    
           
      


        }
        
        
        this.cancelAction = this.cancelAction.bind(this);
        this.handlerovertimeType = this.handlerovertimeType.bind(this);
       // this.handlerovertimeAvailability = this.handlerovertimeAvailability.bind(this);
    }
    getInitialState() {
        return {
          
            badge: '',
            firstName: '',
            lastName: '',
            email: '',
            groupName:false,
            selectedTab:'tab1',
            setSelectedTab:'',
            content:'',
            searchValue:'',
            searchQuery:'',
            otData:[],
            overtimeType:'',
            effectiveDate: null,
            showPopup:false

        }
    }
    
    
    componentDidMount(): void {
        var ranNum = Math.round(100000 + Math.random() * 900000);
        this.setState({randomID : ranNum});
        this.GetUserdata();
       // this.setState({isEditMode : true});
       // alert(this.state.isEditMode);
        //this.fetchDataFromSharePoint();
        this.fetchDataFromSharePoint();
        this.fetchDataFromSharePointOT();

    }
  //   private getNamesByBusRail = async (badge: string) => {
  //   try {
  //     const item = await fetchUserData(badge);
  //    // const item = data.find((user: { Badge: string }) => user.Badge === badge);
  //     if (item) {
  //       return {
  //         firstName: item.employeeFirstName || '',
  //         lastName: item.employeeLastName || '',
  //         emailAddress: item.employeeEmailAddress || ''
  //       };
  //     } else {
  //       return {
  //         firstName: '',
  //         lastName: '',
  //         emailAddress: ''
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error fetching names: ", error);
  //     return {
  //       firstName: '',
  //       lastName: '',
  //       emailAddress: ''
  //     };
  //   }
  // };
//   private getSPData(): void {      
//     sp.web.currentUser.groups.get().then((r: any) => {  
//       let grpNames: string ="";  
//       r.forEach((grp: SiteGroup) =>{  
//         grpNames += "<li>"+grp["Title"]+"</li>"  
//       });      
//       grpNames = "<ul>"+grpNames+"</ul>";  
//       this.renderData(grpNames);  
//     });  
//   } 
async GetUserdata():Promise<void>{
       const group = await sp.web.currentUser.groups();
        let names = group.map(r => r.LoginName);
        
        if( names.length > 0 )
            {        this.setState({groupName:true});}

}

  async fetchDataFromSharePoint(): Promise<void> {
 
    try {
      const data = await sp.web.lists.getByTitle('SUOT').items.select('Id', 'Badge', 'HomeDivision','FirstName','LastName','FormID').orderBy('Id',false).getAll();
      this.setState({ records: data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

  async fetchDataFromSharePointOT(): Promise<void> {
 
    try {
      const data = await sp.web.lists.getByTitle('OT').items.select('Id','field_3', 'field_100','field_83','field_101').orderBy('Id',false).getAll();
      this.setState({ otData: data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
 

  async fetchDataById(id: number): Promise<void> {
    
    try {
        const item = await sp.web.lists.getByTitle('SUOT').items.getById(id).get();
        this.setState({ 
            
            firstName: item.FirstName,
            lastName: item.LastName,
           
            badge: item.Badge,
            email: item.Email,
            showPopup: true
        
           
    
        });
    } catch (error) {
        console.error("Error fetching data by ID:", error);
    }
}
async fetchOTDataById(id: number): Promise<void> {
    
    try {
        const item = await sp.web.lists.getByTitle('OT').items.getById(id).get();
        this.setState({ 
            
            firstName: item.field_83,
            lastName: item.field_101,
           
            badge: item.field_3,
            email: item.field_103,
            showPopup: true
        
           
    
        });
    } catch (error) {
        console.error("Error fetching data by ID:", error);
    }
}
private getNamesByBusRailAB = async (badge: string) => {
    try {
      const data = await fetchUserData(badge);
      //const item = data.find((user: { Badge: string }) => user.Badge === badge);
      if (data) {
        return {
            approverFirstName: data.employeeFirstName,
            approverLastName: data.employeeLastName,
            approverEmail: data.employeeEmailAddress
        };
      } else {
        return {
            approverFirstName: '',
            approverLastName: '',
            approverEmail: ''
        };
      }
    } catch (error) {
      console.error("Error fetching names: ", error);
      return {
        approverFirstName: '',
        approverLastName: '',
        approverEmail: ''
      };
    }
}


  toggleEditMode = () => {
    this.setState((prevState: { isEditMode: any; }) => ({
        isEditMode: !prevState.isEditMode
    }));
  }
  // Checks all the controls have data and submits the record to SUot list
    private createNewItemforsubmit = async () => {

       //const overtimeType = this.state.isThisScheduled ? "Scheduled Overtime" : "Unscheduled Overtime";
        //const overtimeString = overtimeType.toString();
        try {


          
           
           
           /* if (!this.state.firstName) {
                validationMessages.push("Please fill in First Name.");
            }
            if (!this.state.lastName) {
                validationMessages.push("Please fill in Last Name.");
            }
            if (!this.state.email) {
                validationMessages.push("Please fill in Email.");
            }*/
            
            // if(!this.state.firstName || !this.state.lastName|| !this.state.email 
            // )
            //   {
            //     return;
            //   }
         
            await sp.web.lists.getByTitle('SUOT').items.add({
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
                
                Badge: this.state.badge,
                Email: this.state.email,
               

            });
            this.setState({ successMessage: "Record has been submitted successfully!" });
            this.setState(this.getInitialState());
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Failed to create item. Please try again.");
        }
    }

// Clears all controls, state and dynamically generates new ID
    cancelAction = () => {
        // Redirect to another page
        var ranNum = Math.round(100000 + Math.random() * 900000);
        this.setState({randomID : ranNum});
        this.toggleForm();
        this.setState(this.getInitialState());
        this.fetchDataFromSharePoint();
        this.GetUserdata();

        this.setState({ showPopup: false }); 
    }


    // Assigns firstname to state variable
    private handlerfirstName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            firstName: newValue

        });
    }
   private  handlerovertimeType = (value:any)=>
        {
          this.setState({overtimeType : value})
        };
    public handleEffectiveDate = (date: any) => {
            //alert(Date);
            this.setState({ effectiveDate: date });
          }
    private handlerlastName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            lasttName: newValue

        });
    }
    private handlerotherInformatiionDetails = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            otherInformatiionDetails: newValue

        });
    }

        handlerovertimeAvailability = (value:any) => 
            {
              this.setState({overtimeavailability : value})
            
            };
   // Assigns hours value to state variable on change
     handlerhours(e: any) {  
     const hours = e.target.value;
        this.setState({ hours });

    }
 
    private handlerSearch(query: string): void {
        console.log('Search query:', query);
        this._searchSharePointList(query);
      }
      private async _searchSharePointList(query: string): Promise<void> {
        if (query.length > 0) {
          const items = await sp.web.lists.getByTitle('SUOT').items.filter(`Badge eq '${query}'`).get();
          console.log('Search results:', items);
          this.setState({records: items});
        }
      }
      private handlerOTSearch(query: string): void {
        console.log('Search query:', query);
        this._searchOTSharePointList(query);
      }
      private async _searchOTSharePointList(query: string): Promise<void> {
        if (query.length > 0) {
          const items = await sp.web.lists.getByTitle('OT').items.filter(`field_3 eq '${query}'`).get();
          console.log('Search results:', items);
        }
      }
    // Assign Minute values to state variable on change
    handlerminutes(e: any) {
        const minutes = e.target.value;
        this.setState({ minutes });

    }
    private handleroverTimeReasion = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            overTimeReasion: newValue

        });
    }
    
    private handlerapproverBagde = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-numeric characters from the input value
        const numericValue = event.target.value.replace(/\D/g, '');
      
        // Limit the input to 6 characters
        const limitedValue = numericValue.slice(0, 5);
      
        // Update the state with the limited numeric value
        this.setState({
            approverBagde: limitedValue
        });
      
        // Fetch data based on the badge number
        const { approverFirstName, approverLastName, approverEmail } = await this.getNamesByBusRailAB(limitedValue);
      
        // Update the state with the fetched data
        this.setState({
            approverFirstName:approverFirstName,
            approverLastName:approverLastName,
            approverEmail: approverEmail
        });
      }
    //   private handlerapproverEmail = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
    //     this.setState({
    //         approverEmail: newValue

    //     });
    // }
    private handlerapproverFirstName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            approverFirstName: newValue

        });
    }
    private handlerapproverLastName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            approverLastName: newValue

        });
    }
    private columns: TableColumn<any>[] = [
        {name: 'FormID', selector: (row) => row.FormID,  sortable: true },
        { name: 'Badge',selector: (row) => row.Badge, sortable: true },
        { name: 'FirstName',selector: (row) => row.FirstName, sortable: true },
        { name: 'LastName',selector: (row) => row.LastName, sortable: true },
        { name: 'Home Division',selector: (row) => row.HomeDivision, sortable: true },
        { name: 'OverTime Division', sortable: true },
        {
            name: 'View', // Name of the column
            //cell: (row) => <FaEdit onClick={() => this.handleEditClick(row.Id)} />,
            cell: (row) => <SlEye  onClick={() => this.handleEditClick(row.Id)} />, // Render the edit icon
            sortable: false, // Make the column not sortable
            button: true, // Indicate that it's a button
          },

      ];
      private otColumns: TableColumn<any>[] = [
        
        { name: 'Badge',selector: (row) => row.field_3, sortable: true },
        { name: 'FirstName',selector: (row) => row.field_83, sortable: true },
        { name: 'LastName',selector: (row) => row.field_101, sortable: true },
        { name: 'Home Division',selector: (row) => row.field_100, sortable: true },
        
        {
            name: 'View', // Name of the column
            //cell: (row) => <FaEdit onClick={() => this.handleEditClick(row.Id)} />,
            cell: (row) => <SlEye  onClick={() => this.handleEditOTClick(row.Id)} />, // Render the edit icon
            sortable: false, // Make the column not sortable
            button: true, // Indicate that it's a button
          },

      ];

    // Formulate table and calls table
   
      // The following method update the download value it helps automate to trigger and share the data
        handledownloadClick = async (id: number) => {
            await sp.web.lists.getByTitle('SUOT').items.getById(id).update({
            checkdownload: "true",
            checkNew:"false"
            //Description: "Here is a updated description"
          });
          //console.log(i);
          this.setState({ successupdateMessage: "Successfully record has shared to your email!" });
            
          }

      // The following method will return entire form on view mode
        handleEditClick = (id: number) => {
            // Fetch data for the item with the given id
            this.fetchDataById(id);
            
            // Set edit mode to true
           this.setState({ isEditMode: false });
        }
        handleEditOTClick = (id: number) => {
            // Fetch data for the item with the given id
            
            this.fetchOTDataById(id);
            
            // Set edit mode to true
           //this.setState({ isEditMode: false });
        }

       
     //fetch approver email through Badge details API and assign to variable
     private async _loadHomeListDropdownOptions(type: string): Promise<void> {
        try {
          const otherSiteUrl = 'https://lacmta.sharepoint.com/sites/MOOP/';
          const listTitle = 'Admin_Mgmt_Lookup';
      
          const web = Web(otherSiteUrl);
          let items: any[];
      
        
            items = await web.lists.getByTitle(listTitle).items.filter(`LookupType eq '${type}'`).get();
        
      
            const homeListDropdownOptions: IDropdownOption[] = items.map(item => ({
              key:  item.field_5,
              text: item.field_6 + "-" + item.field_5,
          })); 
      
          // this.setState({
          //   homeListDropdownOptions,
          //   selectedBusrailType: type
          // });
          const hmID = homeListDropdownOptions.map(({ key }) => key);
      const hmfiltered = homeListDropdownOptions.filter(({ key }, index) =>
        !hmID.includes(key, index + 1));
      //const fhmfiltered = [...hmfiltered].sort((a:any,b:any) => {return b.key - a.key});
      const fhmfiltered = [...hmfiltered].sort((a:any,b:any) => {return b.text > a. text ? -1 : 1 });
      
          this.setState({divisonall:fhmfiltered})
        } catch (error) {
          console.error('Error fetching qualifications:', error);
        }
      }
 
 


    private handlerbadge = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-numeric characters from the input value
        const numericValue = event.target.value.replace(/\D/g, '');
      
        // Limit the input to 6 characters
        const limitedValue = numericValue.slice(0, 5);
      
        // Update the state with the limited numeric value
        this.setState({
          badge: limitedValue
        });
        if(event.target.value.length !== 5) {

            return;

        }
        // Fetch data based on the badge number
     //   const { firstName, lastName, emailAddress } = await this.getNamesByBusRail(limitedValue);
      
        // Update the state with the fetched data
      //   this.setState({
      //     firstName: firstName,
      //     lastName: lastName,
      //     email: emailAddress
      //   });
      }


    private handleremailAddress = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: String) => {
        this.setState({
            email: newValue

        });
    }
    // private handleTabChange = (key : string) => {
    //     this.setState({setSelectedTab:key})
    //     //setSelectedTab(key);
     
      
    // };
      

    handlerbusRail(e: any) {
        const busRailDDL = e.target.value;
        //this._loadDivisionDropdownOptions(e.target.value as string);
       // this._loadHomeListDropdownOptions(e.target.value as string);
       // this._loadOTListDropdownOptions(e.target.value as string);
        this.setState({ busRailDDL });

    };
    private onBusrailChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        if (option) {
         // this._loadQualificationsDropdownOptions(option.key as string);
        // this._loadDivisionDropdownOptions(option.key as string);
         this._loadHomeListDropdownOptions(option.key as string);
        // this._loadOTListDropdownOptions(option.key as string);
          this.setState({ busRailDDL: option.key as string });
        }
      }
    

  
  

   





    handleCheckboxChange = (day: string, key: string) => {
        // Update the checkbox state for the specified day
        this.setState((prevState: { [x: string]: { [x: string]: any; }; }) => ({
            [day]: {
                ...prevState[day],
                [key]: !prevState[day][key]
            }
        }));
    };


    handlerisThisScheduled = (value: any) => {
        this.setState({ isThisScheduled: value });
    };
   
 private onChange_homeDivision = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number, value?: string): void => {
        if (option) {
          this.setState({ 
            homedivisiontext: option?.key
          });

        }
    }
    private onChange_OTDivision = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number, value?: string): void => {
        if (option) {
          this.setState({ 
            otdivisiontext: option?.key
          });
     
        }
    }
  

    public handledateofOverTime = (date: any) => {
        
        this.setState({ dateofOverTime: date });
    }
   
   

    handlerstartTime = (e:any) => {
        const time = e.target.value;
        this.setState({ startTime: time });
    }
schedule =() =>
{
    this.fetchDataFromSharePoint();
    return(
        <div style={{ maxHeight: 'calc(110vh - 10px)', overflow: 'auto' }}>
            <div className="datatable-crud-demo requesterTable mt-4" style={{ padding: '1rem' }}>
            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Search<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <SearchBox
          placeholder="Search here"
        
          onSearch={this.handlerSearch.bind(this)}  // Trigger search when the search button is clicked or Enter is pressed
          onChange={(_, newValue) => this.setState({ searchQuery: newValue || '' })} // For real-time search (optional)
        />
         </div>
         </div>

       
         </div>

         
            <DataTable
          columns={this.columns}
          data={this.state.records}
          noHeader
          pagination
          highlightOnHover
          pointerOnHover
        />
        
      </div>
     
    )

}
OT =() =>
    {
        this.fetchDataFromSharePointOT();
        return(
            <div style={{ maxHeight: 'calc(110vh - 10px)', overflow: 'auto' }}>
                <div className="datatable-crud-demo requesterTable mt-4" style={{ padding: '1rem' }}>
                <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                                <div style={{ marginBottom: '5px' }}>
                                    <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Search<span style={{ color: 'red' }}>*</span></label>
                                </div>
                                <SearchBox
              placeholder="Search here"
            
              onSearch={this.handlerOTSearch.bind(this)}  // Trigger search when the search button is clicked or Enter is pressed
              onChange={(_, newValue) => this.setState({ searchQuery: newValue || '' })} // For real-time search (optional)
            />
             </div>
             </div>
    
           
             </div>
    
             
                <DataTable
              columns={this.otColumns}
              data={this.state.otData}
              noHeader
              pagination
              highlightOnHover
              pointerOnHover
            />
            
          </div>
         
        )
    
    }

renderOTForm =() =>{
    return(
<div>
        <div style={{ maxHeight: 'calc(110vh - 100px)', overflow: 'auto' }}>
        
        <div className="datatable-crud-demo requesterTable mt-4" style={{ padding: '1rem' }}>
          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
            
            
          </div>
         

          <h2 style={{ textAlign: 'left' }}>Employee Information</h2>
          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
          <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Badge<span style={{ color: 'red' }}>*</span></label>
              </div>
              <TextField
                //label="Badge"
                id="txtBadge"
                required={false}
                value={this.state.badge}
                name='Badge'
                onChange={this.handlerbadge}
                style={{ width: '100%' }}
                
              />
              {!this.state.badge && <div style={{color:'red'}}>{this.state.errorbadge}</div>}
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Email<span style={{ color: 'red' }}>*</span></label>
              </div>
              <TextField
                //label="Email"
                id="txtEmailAddress"
                required={false}
                value={this.state.emailAddress}
                name='EmailAddress'
                onChange={this.handleremailAddress}
                style={{ width: '100%' }}
                disabled
              />
            </div>

            
          </div>


          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
       
           
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>First Name<span style={{ color: 'red' }}>*</span></label>
              </div>
              <TextField
                //label="First Name"
                id="txtFName"
                required={false}
                value={this.state.firstName}
                name='Name'
                onChange={this.handlerfirstName}
                style={{ width: '100%' }}
                disabled
              />
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Last Name<span style={{ color: 'red' }}>*</span></label>
              </div>
              <TextField
                //label="Last Name"
                id="txtLastName"
                required={false}
                value={this.state.lastName}
                name='EmailAddress'
                onChange={this.handlerlastName}
                style={{ width: '100%' }}
                disabled
              />
            </div>

          </div>
          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            
              <TextField
                label="Cell Phone Number"
                id="txtCellPhoneNumber"
                required={false}
                value={this.state.phonenumber} // Adjust state variable accordingly
                name='CellPhoneNumber'
                //onChange={this.handlercellPhonenumber}
                
                
              />
              {!this.state.phonenumber && <div style={{color:'red'}}>{this.state.errorphonenumber}</div>} 
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            
              <TextField
                label="Home Phone Number"
                id="txtHomePhoneNumber"
                required={false}
                value={this.state.homePhoneNumber} // Adjust state variable accordingly
                name='HomePhoneNumber'
                //onChange={this.handlerhomePhoneNumber}
                //disabled={!isEditMode}
              />
              {!this.state.homePhoneNumber && <div style={{color:'red'}}>{this.state.errorhomenumber}</div>} 
            </div>
          </div>


          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
          <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Seniority Date<span style={{ color: 'red' }}>*</span></label>
              </div>
              <DateTimePicker
                //label="Agreement Created date"
                dateConvention={DateConvention.Date}
                showLabels={false}
                formatDate={(date: Date) => date.toLocaleDateString()}
                //timeConvention={TimeConvention.Hours24}  
                value={this.state.seniorityDate}
                //onChange={this.handleSeniorityDate}
                //disabled={!isEditMode}


              //timeDisplayControlType={TimeDisplayControlType.Dropdown}
              />
              {!this.state.seniorityDate && <div style={{color:'red'}}>{this.state.errorsenioritydate}</div>}
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Seniority Position<span style={{ color: 'red' }}>*</span></label>
              </div>
              <TextField
                //label="Seniority Position"
                id="txtSeniorityPosition"
                required={false}
                value={this.state.seniorityPosition} // Adjust state variable accordingly
                name='SeniorityPosition'
                //onChange={this.handlerseniorityPosition}
                //inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Restrict input to numbers
                //onInput={this.handleInput.bind(this)}
                
                maxLength={2}
              />
              {!this.state.seniorityPosition && <div style={{color:'red'}}>{this.state.errorseniorityposition}</div>}
            </div>
            
          </div>
      
          <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
            


            {/* <div className="ms-Grid-col ms-md6 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
                    <TextField
                        label="Overtime Division"
                        id="txtOvertimeDivision"
                        required={false}
                        value={this.state.overtimeDivision}
                        name='OvertimeDivision'
                        onChange={this.handlerovertimeDivision}
                        style={{ width: '100%' }}
                    />
                </div> */}
          </div>



          <div>

            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <h2>Overtime Availability Details</h2>
            </div>
            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
            <div className="ms-Grid-col ms-md6 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              
              <div style={{ marginBottom: '3px' }}>
                <label htmlFor="DEngagement" style={{ fontWeight: '600' }}>Bus/Rail<span style={{ color: 'red' }}>*</span></label>
              </div>
             

        <Dropdown
          //label="Busrail Type"
          options={this.state.busrailDropdownOptions}
          onChange={this.onBusrailChange}
          selectedKey={this.state.selectedBusrailType}
          //disabled={!isEditMode}
        />
        {!this.state.selectedBusrailType && <div style={{color:'red'}}>{this.state.errorbusrail}</div>}

              </div>
              <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Effective Date<span style={{ color: 'red' }}>*</span></label>
              </div>
              <DateTimePicker
                //label="Agreement Created date"
                dateConvention={DateConvention.Date}
                showLabels={false}
                formatDate={(date: Date) => date.toLocaleDateString()}
                //timeConvention={TimeConvention.Hours24}  
                value={this.state.effectiveDate}
                onChange={this.handleEffectiveDate}
                //disabled={!isEditMode}
              //style={{ width: '100%' }}
              //timeDisplayControlType={TimeDisplayControlType.Dropdown}
              />
              {!this.state.effectiveDate && <div style={{color:'red'}}>{this.state.erroreffectivedate}</div>}
            </div>
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
          <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Overtime Availability Type<span style={{ color: 'red' }}>*</span></label>
          </div>
          <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
           
           <input type="Radio" id ="ch" 
                 style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                 checked = {this.state.overtimeType === 'Single Day Availability'}
                 onChange={() => this.handlerovertimeType('Single Day Availability')}
                 />
                <label>Single Day Availability</label>
               </div>
               <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
              
             <input type="Radio" id ="ch" 
                 style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                 checked = {this.state.overtimeType === 'Continuous Availability'}
                 onChange={() => this.handlerovertimeType('Continuous Availability')}/>
                <label> Continuous Availability</label>
               </div>
               
          

          {!this.state.overtimeType && <div style={{color:'red'}}>{this.state.errorovertimetype}</div>}
            </div>
          

            <div className="ms-Grid-col ms-md6 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
              
              <div style={{ marginBottom: '3px' }}>
                <label htmlFor="DEngagement" style={{ fontWeight: '600' }}>Home Division<span style={{ color: 'red' }}>*</span></label>
              </div>
           

               : <Dropdown
    // label="HomeDivision"
    //multiSelect
    options={this.state.divisonall}
    onChange={this.onChange_homeDivision}
    selectedKey={this.state.homedivisiontext}
    //disabled={!isEditMode}
    //styles={{ dropdown: { width: 500 } }}
    
/>
        

            
            {!this.state.homedivisiontext && <div style={{color:'red'}}>{this.state.errorhomedivision}</div>}
              </div>

              <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
              <div style={{ marginBottom: '3px' }}>
              <label style={{ marginBottom: '10px', fontWeight: '600' }}>Which Division(s)/Location(s) is the overtime Availability for?<span style={{ color: 'red' }}>*</span></label>
              </div>
              
            
           <Dropdown 
           multiSelect
           options={this.state.otdivisionDropdownOptions}
    //onChange={this.onOTDivisionChange}
    selectedKey={this.state.selectedOT}
    //disabled={!isEditMode}
    //styles={{ dropdown: { width: 940 } }}
     />
              
              {!this.state.selectedOT && <div style={{color:'red'}}>{this.state.errorotdivision}</div>}
                        
            </div>
            <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
              <div style={{ marginBottom: '3px' }}>
              <label style={{ marginBottom: '10px', fontWeight: '600'  }}>Qualifications<span style={{ color: 'red' }}>*</span></label>
              </div>
             

              <Dropdown
                    // label="Qualifications"
                    multiSelect
                    options={this.state.qualificationsDropdownOptions}
                  //  onChange={this.onQualificationChange}
                    selectedKeys={this.state.selectedQualifications}
                    disabled={!this.state.selectedBusrailType}
                  // styles={{ dropdown: { width: 940 } }}
                    
                />
 
  {!this.state.selectedQualifications && <div style={{color:'red'}}>{this.state.errorqualification}</div>}
             
            </div>

           
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '10px' }}>
      <label style={{ marginBottom: '10px', fontWeight: '600'  }}>Current work Start Shift Timings<span style={{ color: 'red' }}>*</span></label>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
            <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
           
                <input type="Radio" id ="ch" 
                      style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                      checked = {this.state.cwsshifttime === 'First Shift(4AM - 11:59AM)'}
                      //onChange={() => this.handlercwsshift("First Shift(4AM - 11:59AM)")}
                      />
                     <label>First Shift(4AM - 11:59AM) </label>
                    </div>
                    <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
                   
                  <input type="Radio" id ="ch" 
                      style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                      checked = {this.state.cwsshifttime === 'Second Shift(12PM-7:59PM)'}
                      //onChange={() => this.handlercwsshift("Second Shift(12PM-7:59PM)")}
                      />
                     <label> Second Shift(12PM-7:59PM)</label>
                    </div>
                    <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
                    
                  <input type="Radio" id ="ch" 
                      style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                      checked = {this.state.cwsshifttime === 'Third Shift(8PM-3:59AM)'}
                     // onChange={() => this.handlercwsshift("Third Shift(8PM-3:59AM)")}
                      />
                     <label> Third Shift(8PM-3:59AM)</label>
                    </div>
                    
              </div>
              <div>
              <div style={{ width: '250px', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
                   
                  <input type="Radio" id ="ch"
                      style={{ marginRight: '5px', width: '20px', height: '20px' }} 
                      checked = {this.state.cwsshifttime === 'Varies Day-To-Day'}
                      //onChange={() => this.handlercwsshift("Varies Day-To-Day")}
                      />
                     <label >  Varies Day-To-Day</label>
                    </div>
              </div>
          {this.state.cwsshifttime ===''  && <div style={{color:'red'}}>{this.state.errorcwsshift}</div>}
      </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '10px' }}>
              <label style={{ marginBottom: '5px', fontWeight: '600'  }}>Current Work Shift (Days and Hours)<span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Sunday</label>
                  <input
                    type="checkbox"
                    id="Sunday"
                    checked={this.state.CWSSunday}
                    // onChange={this.handlerCWSSunday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Monday</label>
                  <input
                    type="checkbox"
                    id="CWSMonday"
                    checked={this.state.CWSMonday}
                    // onChange={this.handlerCWSMonday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Tuesday</label>
                  <input
                    type="checkbox"
                    id="CWSTuesday"
                    checked={this.state.CWSTuesday}
                    // onChange={this.handlerCWSTuesday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Wednesday</label>
                  <input
                    type="checkbox"
                    id="CWSWednesday"
                    checked={this.state.CWSWednesday}
                    // onChange={this.handlerCWSWednesday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Thursday</label>
                  <input
                    type="checkbox"
                    id="CWSThursday"
                    checked={this.state.CWSThursday}
                    // onChange={this.handlerCWSThursday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Friday</label>
                  <input
                    type="checkbox"
                    id="CWSFriday"
                    checked={this.state.CWSFriday}
                    // onChange={this.handlerCWSFriday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Saturday</label>
                  <input
                    type="checkbox"
                    id="CWSSaturday"
                    checked={this.state.CWSSaturday}
                    // onChange={this.handlerCWSSaturday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
              </div>
              {/* {!this.currentWorkShiftDH() && <div style={{color:'red'}}>{this.state.errorcurrentworkshift}
                </div>} */}
            </div>
            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
              {/* <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Start Time<span style={{ color: 'red' }}>*</span></label>
              </div>
                <TextField
                  //label="Start Time"
                  id="txtCellPhoneNumber"
                  required={false}
                  value={this.state.startTime} // Adjust state variable accordingly
                  name='CellPhoneNumber'
                  onChange={this.handlerstartTime}
                />
              </div> */}
              <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Start Time<span style={{ color: 'red' }}>*</span></label>
              </div>              

              <input
                    type="time"
                    id="txtAgreementCreatedDate"
                    name="txtAgreementCreatedDate"
                    value={this.state.startTime}
                    onChange={this.handlerstartTime}
                    style={{ width: '100%' }}
                    
                />
                {!this.state.startTime && <div style={{color:'red'}}>{this.state.errorstarttime}</div>}
            </div>
             
              <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(50% - 0.67rem)' }}>
              <div style={{ marginBottom: '5px' }}>
                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>End Time<span style={{ color: 'red' }}>*</span></label>
              </div>
              <input
                    type="time"
                    id="txtAgreementCreatedDate"
                    name="txtAgreementCreatedDate"
                    value={this.state.endTime}
                    //onChange={this.handlerendTime}
                    style={{ width: '100%' }}
                    //disabled={!isEditMode}
                />
                {!this.state.endTime && <div style={{color:'red'}}>{this.state.errorendtime}</div>}
            </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '10px' }}>
              <label style={{ marginBottom: '5px', fontWeight: '600'  }}>Current Day off<span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Sunday</label>
                  <input
                    type="checkbox"
                    id="Sunday"
                    checked={this.state.CDOSunday}
                    //onChange={this.handlerCDOSunday}
                    //disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Monday</label>
                  <input
                    type="checkbox"
                    id="CWSMonday"
                    checked={this.state.CDOMonday}
                    //onChange={this.handlerCDOMonday}
                    //disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Tuesday</label>
                  <input
                    type="checkbox"
                    id="CWSTuesday"
                    checked={this.state.CDOTuesday}
                    // onChange={this.handlerCDOTuesday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Wednesday</label>
                  <input
                    type="checkbox"
                    id="CWSWednesday"
                    checked={this.state.CDOWednesday}
                    // onChange={this.handlerCDOWednesday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Thursday</label>
                  <input
                    type="checkbox"
                    id="CWSThursday"
                    checked={this.state.CDOThursday}
                    // onChange={this.handlerCDOThursday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Friday</label>
                  <input
                    type="checkbox"
                    id="CWSFriday"
                    checked={this.state.CDOFriday}
                    // onChange={this.handlerCDOFriday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
                <div style={{ marginRight: '10px', width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ marginBottom: '5px' }}>Saturday</label>
                  <input
                    type="checkbox"
                    id="CWSSaturday"
                    checked={this.state.CDOSaturday}
                    // onChange={this.handlerCDOSaturday}
                    // disabled={!isEditMode}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                </div>
              </div>
              {/* {!this.currentDayOff() && <div style={{color:'red'}}>{this.state.errorcurrentdayoff}</div>} */}
            </div>


            <label style={{ marginBottom: '5px', fontWeight: '600'  }}>Availability Schedule <span style={{ color: 'red' }}>*</span></label>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px' }}></th>
                  <th style={{ padding: '8px' }}>AM</th>
                  <th style={{ padding: '8px' }}>PM</th>
                  <th style={{ padding: '8px' }}>OWL</th>
                  <th style={{ padding: '8px' }}>ANY</th>
                  <th style={{ padding: '8px' }}>4 HRs Before</th>
                  <th style={{ padding: '8px' }}>4 HRS After</th>
                  <th style={{ padding: '8px' }}>No OverTime</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>Sunday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="SundayAM"
                      checked={this.state.SundayAM}
                    //   onChange={this.handlerSundayAM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayPM"
                      checked={this.state.SundayPM}
                    //   onChange={this.handlerSundayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.SundayOWL}
                    //   onChange={this.handlerSundayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.SundayANY}
                    //   onChange={this.handlerSundayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Sunday4HRsBefore}
                    //   onChange={this.handlerSunday4HRsBefore}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Sunday4HRSAfter}
                    //   onChange={this.handlerSunday4HRSAfter}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.SundayNoOverTime}
                    //   onChange={this.handlerSundayNoOverTime}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Monday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="SundayAM"
                      checked={this.state.MondayAM}
                    //   onChange={this.handlerMondayAM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayPM"
                      checked={this.state.MondayPM}
                    //   onChange={this.handlerMondayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.MondayOWL}
                    //   onChange={this.handlerMondayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.MondayANY}
                    //   onChange={this.handlerMondayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Monday4HRsBefore}
                    //   onChange={this.handlerMonday4HRsBefore}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Monday4HRSAfter}
                    //   onChange={this.handlerMonday4HRSAfter}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.MondayNoOverTime}
                    //   onChange={this.handlerMondayNoOverTime}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Tuesday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="SundayAM"
                      checked={this.state.TuesdayAM}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerTuesdayAM}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayPM"
                      checked={this.state.TuesdayPM}
                    //   onChange={this.handlerTuesdayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.TuesdayOWL}
                    //   onChange={this.handlerTuesdayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.TuesdayANY}
                    //   onChange={this.handlerTuesdayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Tuesday4HRsBefore}
                    //   onChange={this.handlerTuesday4HRsBefore}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Tuesday4HRSAfter}
                    //   onChange={this.handlerTuesday4HRSAfter}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.TuesdayNoOverTime}
                    //   onChange={this.handlerTuesdayNoOverTime}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Wednesday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="SundayAM"
                      checked={this.state.WednesdayAM}
                    //   onChange={this.handlerWednesdayAM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayPM"
                      checked={this.state.WednesdayPM}
                    //   onChange={this.handlerWednesdayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.WednesdayOWL}
                    //   onChange={this.handlerWednesdayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.WednesdayANY}
                    //   onChange={this.handlerWednesdayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Wednesday4HRsBefore}
                    //   onChange={this.handlerWednesday4HRsBefore}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Wednesday4HRSAfter}
                    //   onChange={this.handlerWednesday4HRSAfter}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.WednesdayNoOverTime}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerWednesdayNoOverTime}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Thursday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="SundayAM"
                      checked={this.state.ThursdayAM}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerThursdayAM}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayPM"
                      checked={this.state.ThursdayPM}
                    //   onChange={this.handlerThursdayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.ThursdayOWL}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerThursdayOWL}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.ThursdayANY}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerThursdayANY}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Thursday4HRsBefore}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerThursday4HRsBefore}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Thursday4HRSAfter}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerThursday4HRSAfter}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.ThursdayNoOverTime}
                    //   onChange={this.handlerThursdayNoOverTime}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Friday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="FridayAM"
                      checked={this.state.FridayAM}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerFridayAM}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="FridayPM"
                      checked={this.state.FridayPM}
                    //   onChange={this.handlerFridayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.FridayOWL}
                    //   onChange={this.handlerFridayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.FridayANY}
                    //   onChange={this.handlerFridayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Friday4HRsBefore}
                    //   onChange={this.handlerFriday4HRsBefore}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Friday4HRSAfter}
                    //   onChange={this.handlerFriday4HRSAfter}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.FridayNoOverTime}
                    //   onChange={this.handlerFridayNoOverTime}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Saturday</td>
                  <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      id="FridayAM"
                    //   checked={this.state.SaturdayAM}
                    //   onChange={this.handlerSaturdayAM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="FridayPM"
                      checked={this.state.SaturdayPM}
                    //   onChange={this.handlerSaturdayPM}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayOWL"
                      checked={this.state.SaturdayOWL}
                    //   onChange={this.handlerSaturdayOWL}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayANY"
                      checked={this.state.SaturdayANY}
                    //   onChange={this.handlerSaturdayANY}
                    //   disabled={!isEditMode}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRsBefore"
                      checked={this.state.Saturday4HRsBefore}
                      //disabled={!isEditMode}
                      //onChange={this.handlerSaturday4HRsBefore}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="Sunday4HRSAfter"
                      checked={this.state.Saturday4HRSAfter}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerSaturday4HRSAfter}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="checkbox"
                      id="SundayNoOverTime"
                      checked={this.state.SaturdayNoOverTime}
                    //   disabled={!isEditMode}
                    //   onChange={this.handlerSaturdayNoOverTime}
                      style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                  </td>
                </tr>
                <tr></tr>
              </tbody>
            </table>
            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                {/* {!this.availabilitySchedule() && <div style={{color:'red'}}>{this.state.erroravailabilityschedule}</div>} */}
                </div>

            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
              <div className="ms-Grid-col ms-md4 mt-3" style={{ width: '100%' }}>
                <TextField
                  label="Additional Details/Other Information"
                  id="txtOtherInformation"
                  required={false}
                  value={this.state.additionalDetails} // Adjust state variable accordingly
                  name='Qualification'
                  //onChange={this.handleradditionalDetails}
                  //multiline
                  style={{ width: '100%' }}
                  //disabled={!isEditMode}
                  maxLength={255}
                />
              </div>
            </div>
          </div>
          <div className="ms-Grid-col ms-md4 mt-3" style={{ width: '50%', marginRight: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ width: '300px', marginBottom: '0.5rem' }}>
          Contact me for overtime when on vacation:<span style={{ color: 'red' }}>*</span>
          </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              id="checkbox-yes"
              checked={this.state.contractmeforovertimewhenonvacation === true}
              //onChange={() => this.handlercontractmeforovertimewhenonvacation(true)}
              style={{ display: 'none' }}
              //disabled={!isEditMode}
            />
            <label htmlFor="checkbox-yes" style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid',
                background: this.state.contractmeforovertimewhenonvacation === true ? '#0078d4' : 'transparent',
                marginRight: '8px',
              }}></div>
              Yes
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="checkbox-no"
              checked={this.state.contractmeforovertimewhenonvacation === false}
              //onChange={() => this.handlercontractmeforovertimewhenonvacation(false)}
              style={{ display: 'none' }}
            />
            <label htmlFor="checkbox-no" style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid',
                background: this.state.contractmeforovertimewhenonvacation === false ? '#0078d4' : 'transparent',
                marginRight: '8px',
              }}></div>
              No
            </label>
          </div>
        </div>
      

            </div>
            {!this.state.contractmeforovertimewhenonvacation&& <div style={{color:'red'}}>{this.state.errorcontact}</div>}
          </div>


          <div className="ms-Grid-col ms-md4 mt-3" style={{ width: '50%', marginRight: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'block', marginBottom: '0.5rem' }}>You are confirming and signing that the following information is..<span style={{ color: 'red' }}>*</span></span>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                <div style={{ marginRight: '1rem' }}>
                  <input
                    type="checkbox"
                    id="yrcheckbox-yes"
                    checked={this.state.youareconfirmingandsigningtheAgreement}
                   // onChange={() => this.handleryouareconfirmingandsigningtheAgreement(true)}
                    style={{ display: 'none' }}
                   // disabled={!isEditMode}
                  />
                  <label htmlFor="yrcheckbox-yes" style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid',
                      background: this.state.youareconfirmingandsigningtheAgreement ? '#0078d4' : 'transparent',
                      marginRight: '8px',
                    }}></div>
                    Yes, I acknowledge the following information
                  </label>
                </div>


              </div>
            </div>
          </div>

          {!this.state.youareconfirmingandsigningtheAgreement&& <div style={{color:'red'}}>{this.state.errorconfirm}</div>}
        </div>



        <div className="ms-Grid-row">
          <div style={{ marginTop: '16px', marginBottom:'16px', paddingLeft: '370px' }}>
            <PrimaryButton id='btnSubmit' onClick={this.createNewItemforsubmit} style={{ marginRight: '100px', height: '32px', backgroundColor: '#0072c6' }}>Submit</PrimaryButton>

            <PrimaryButton id='btnSubmit' onClick={this.cancelAction} style={{ backgroundColor: '#0072c6' }}>Cancel</PrimaryButton>
          </div>
        </div>
      </div>
      </div>


    )
}


    renderForm = () => {
        // Return the JSX for your form inside the modal
        //const { isEditMode } = this.state;
       // alert(isEditMode);
        if(this.state.groupName == false)
        {
            return(
                <div>
                    You aren't authorized to use the app.
                </div>

            )
        }
        else{
            return (
            <div style={{ maxHeight: 'calc(110vh - 100px)', overflow: 'auto' }}>
            <div className="datatable-crud-demo requesterTable mt-4" style={{ padding: '1rem' }}>
            <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',gap:'10px'}}>
             
            <div className="ms-Grid-col  ms-md2">

              

            <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Form ID</label>
            
            </div>
            <div className=" ms-md4">
              <TextField
                                //label="Email"
                                id="txtFormID"
                                required={false}
                                value={this.state.FormID}
                                name='FormID'
                                //onChange={this.handleremailAddress}
                                style={{ width:'100%',padding:'6px 12px' }}
                                disabled ={true}
                                
                            />
                            </div>
                            <div className="ms-Grid-col  ms-md10">
              <span style={{textAlign:'center',fontWeight:'bold',fontSize:'18px'}}>
                BUS UNSCHEDULED OVERTIME FORM
              </span>
             
              </div>
              <div className="ms-Grid-col  ms-md2">
              
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Created Date</label>
                                </div>
                                <div className="ms-Grid-col  ms-md4">
                            <TextField
                                //label="Email"
                                id="txtFormID"
                                required={false}
                                value={this.state.FormID}
                                name='FormID'
                                
                                //onChange={this.handleremailAddress}
                                style={{ width: '100%',textAlign:'center',padding:'6px 12px'  }}
                                disabled ={true}
                            />
                            </div>
                            
              
              </div>
              <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',backgroundColor:'lightgray',height:'3px'}}>
                </div>
              
                <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',gap:'10px' }}>
              <div className="ms-Grid-col  ms-md4">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' ,width:'100%'}}>First Name<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md6">
              <TextField
                                //label="Last Name"
                                id="txtFName"
                                required={false}
                                value={this.state.firstName}
                                name='Name'
                                onChange={this.handlerfirstName}
                                style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                  <div className="ms-Grid-col  ms-md4 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' ,width:'100%'}}>Badge<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md6 ">
          
              <TextField
                                //label="Last Name"
                                id="txtBadge"
                                required={false}
                                value={this.state.badge}
                                name='Bagde'
                                onChange={this.handlerbadge}
                               style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                  <div className="ms-Grid-col  ms-md4 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600',width:'100%' }}>Email<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md6 ">
              <TextField
                                //label="Email"
                                id="txtEmailAddress"
                                required={false}
                                value={this.state.email}
                                name='approverBagde'
                                onChange={this.handleremailAddress}
                                style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                </div>
             
              <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',gap:'10px'}}>  
              <div className='ms-Grid-col ms-md2'>
              <label htmlFor="DEngagement" style={{ fontWeight: '600' }}>Home Division</label>
              </div>
              <div className='ms-Grid-col ms-md4'>
                <Dropdown
                // label="Qualifications"
                //multiSelect
                options={this.state.divisonall}
                onChange={this.onChange_homeDivision}
                selectedKey={this.state.homedivisiontext}
                //disabled={!isEditMode}
                styles={{ dropdown: { width: 300} }}

                /> 
                </div>
                <div className='ms-Grid-col ms-md2'>
              <label htmlFor="DEngagement" style={{ fontWeight: '600' }}>Overtime Division</label>
              </div>
              <div className='ms-Grid-col ms-md4'>
                <Dropdown
                    
                    options={this.state.otdivision}
                    onChange={this.onChange_OTDivision}
                    selectedKey={this.state.otdivisiontext}
                    //disabled={!isEditMode}
                 styles={{ dropdown: { width:300} }}
                    
                />  
                </div>
 
                </div>
                <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',backgroundColor:'lightgray',height:'3px'}}>
                </div>
                <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',gap:'12px'}}>
                  <div className="ms-Grid-col  ms-md2 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '500' }}>Date Overtime<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md3 ">
              <DateTimePicker
                                //label="Agreement Created date"
                                dateConvention={DateConvention.Date}
                                showLabels={false}
                                formatDate={(date: Date) => date.toLocaleDateString()}
                                //timeConvention={TimeConvention.Hours24}  
                                value={this.state.dateofOverTime}
                                
                                onChange={this.handledateofOverTime}
                              //  disabled={!isEditMode}
                                // style={{ width: '90%' }}
                            //timeDisplayControlType={TimeDisplayControlType.Dropdown}
                            />
                             </div>
                             <div className="ms-Grid-col  ms-md4 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '500' }}>StartTime<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md3 ">
              <input
                    type="time"
                    id="txtAgreementCreatedDate"
                    name="txtAgreementCreatedDate"
                    value={this.state.startTime}
                    onChange={this.handlerstartTime}
                    style={{height: '27px' }}
                    //disabled={!isEditMode}
                /></div>
                   <div className="ms-Grid-col  ms-md4 ">
                              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '500' }}>Overtime worked<span style={{ color: 'red' }}>*</span></label>
                             
                              <select
                                id="DEngagement"
                                name="DEngagement"
                                value={this.state.hours}
                                onChange={this.handlerhours.bind(this)}
                                className="form-control"
                                style={{ marginBottom: '10px', height: '32px', padding: '6px 12px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                //disabled={!isEditMode}
                            >
                                <option value="select hours">Select hours</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                               

                            </select>
                            </div>
                            <div className="ms-Grid-col  ms-md4 ">
                            <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '500' }}>Minutes<span style={{ color: 'red' }}>*</span></label>
                            <select
                                id="DEngagement"
                                name="DEngagement"
                                value={this.state.minutes}
                                onChange={this.handlerminutes.bind(this)}
                                className="form-control"
                                style={{ marginBottom: '10px',  height: '32px', padding: '6px 12px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                //disabled={!isEditMode}
                            >
                                <option value="Select  minutes">Select  minutes</option>
                                {/* {this.state.homeDivisionDDLList.map((elem: any, index: any) => (
                        <option key={index} value={elem}>{elem}</option>
                      ))} */}
                                <option value="00">00</option>
                                <option value="05">05</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                                <option value="55">55</option>
                               
                                

                            </select>
                            </div>

              </div>
              <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' ,gap:'5px' }}>
              <div className="ms-Grid-col  ms-md2">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approver Badge<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md4">
              <TextField
                                //label="Last Name"
                                id="txtapproverBagde"
                                required={false}
                                value={this.state.approverBagde}
                                name='approverBagde'
                                onChange={this.handlerapproverBagde}
                                //style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                  <div className="ms-Grid-col  ms-md4 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approver FirstName<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md4 ">
          
              <TextField
                                //label="Last Name"
                                id="txtapproverBagde"
                                required={false}
                                value={this.state.approverFirstName}
                                name='approverBagde'
                                onChange={this.handlerapproverFirstName}
                              //  style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                  <div className="ms-Grid-col  ms-md4 ">
              <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approver LastName<span style={{ color: 'red' }}>*</span></label>
              </div>
              <div className="ms-Grid-col  ms-md4 ">
              <TextField
                                //label="Last Name"
                                id="txtapproverBagde"
                                required={false}
                                value={this.state.approverLastName}
                                name='approverBagde'
                                onChange={this.handlerapproverLastName}
                              //  style={{ width: '100%' }}
                               // disabled={!isEditMode}
                                

                            />
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                        <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Overtime Reason<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="Last Name"
                                id="txtLastName"
                                required={false}
                                value={this.state.overTimeReasion}
                                name='EmailAddress'
                                
                                onChange={this.handleroverTimeReasion}
                                style={{ width: '100%' }}
                                multiline
                                //disabled={!isEditMode}
                                maxLength={255}

                            />
                            { !this.state.overTimeReasion && <div  style={{color: 'red' }}>{this.state.erroroverTimeReason}</div>}
                        </div>
<div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Other Information/Details</label>
                            </div>
                            <TextField
                                //label="Last Name"
                                id="txtLastName"
                                required={false}
                                value={this.state.otherInformatiionDetails}
                                name='EmailAddress'
                                onChange={this.handlerotherInformatiionDetails}
                                style={{ width: '100%' }}
                                multiline
                              //  disabled={!isEditMode}
                                maxLength={255}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem',height:'3px',backgroundColor:'lightgray' }}></div>
                    <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                    <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Actual Hours Worked<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="First Name"
                                id="txtFName"
                                required={false}
                               //value={this.state.firstName}
                                name='Name'
                                onChange={this.handlerfirstName}
                                style={{ width: '100%' }}
                           
                              
                            />
                        </div>
                        <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approval Status<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <select
                                id="DEngagement"
                                name="DEngagement"
                                value={this.state.hours}
                                onChange={this.handlerhours.bind(this)}
                                className="form-control"
                                style={{ marginBottom: '10px', width: '100%', height: '32px', padding: '6px 12px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                //disabled={!isEditMode}
                            >
                                <option value="select overtimehours">Select status </option>
                                <option value="Verified">Verified</option>
                                <option value="Inprogress">Inprogress</option>
                                <option value="Closed">Closed</option>
                          
                               

                            </select>

                            
                        </div>
 <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approver <span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="Last Name"
                                id="txtLastName"
                                required={false}
                                value={this.state.lastName}
                                name='lastName'
                                onChange={this.handlerlastName}
                                style={{ width: '100%' }}
                      
                            />

                            
                        </div>
                     </div> 
                     <div className="ms-Grid-row" style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                    <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Approval Comments<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="First Name"
                                id="txtFName"
                                required={false}
                               // value={this.state.firstName}
                                name='Name'
                                onChange={this.handlerfirstName}
                                style={{ width: '100%' }}
                           
                              
                            />
                        </div>
                        <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Comments<span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="Last Name"
                                id="txtLastName"
                                required={false}
                               // value={this.state.lastName}
                                name='lastName'
                                onChange={this.handlerlastName}
                                style={{ width: '100%' }}
                      
                            />

                            
                        </div>
 <div className="ms-Grid-col ms-md4 mt-3" style={{ marginRight: '1rem', width: 'calc(100% - 0.67rem)' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <label htmlFor="txtAgreementCreatedDate" style={{ fontWeight: '600' }}>Date Approved <span style={{ color: 'red' }}>*</span></label>
                            </div>
                            <TextField
                                //label="Last Name"
                                id="txtLastName"
                                required={false}
                                value={this.state.lastName}
                                name='lastName'
                                onChange={this.handlerlastName}
                                style={{ width: '100%' }}
                      
                            />

                            
                        </div>
                     </div>             


                    
                    <div className="ms-Grid-row">
                        <div style={{ marginTop: '16px', marginBottom: '16px', paddingLeft: '280px' }}>
                            <PrimaryButton id='btnSubmit' onClick={this.createNewItemforsubmit} style={{ marginRight: '100px', height: '32px', backgroundColor: '#107C10' }}>Submit</PrimaryButton>

                          

                            <PrimaryButton id='btnSubmit' onClick={this.cancelAction} style={{ backgroundColor: '#A80000' }}>Cancel</PrimaryButton>
                        </div>
                    </div>
                </div>
             </div>
            )   ;
        }
    };
    toggleForm = (): void => {
        this.setState((prevState: { showPopup: any; }) => ({
            showPopup: !prevState.showPopup,

        }));
    };

    renderSuccessMessage = () => {
        const { successMessage } = this.state;
        if (successMessage) {
            return (
                <Modal isOpen={true} onDismiss={this.clearSuccessMessage}>
                    <div style={{ padding: '50px', width: '400px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '10px' }}>{successMessage}</div>
                        <PrimaryButton onClick={this.handleOkButtonClick} style={{ margin: 'auto' }}>OK</PrimaryButton>
                    </div>
                </Modal>
            );
        }
        return null;
    };
    renderSuccessUpdateMessage = () => {
        const { successupdateMessage } = this.state;
        
        if (successupdateMessage) {
          return (
            <Modal isOpen={true} onDismiss={this.clearSuccessupdateMessage}>
              <div style={{ padding: '50px', width: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '10px' }}>{successupdateMessage}</div>
                <PrimaryButton onClick={this.handleUpdateButtonClick} style={{ margin: 'auto' }}>OK</PrimaryButton>
              </div>
            </Modal>
          );
        }
        return null;
      };

    //    onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    //     console.log(`The ${data.value} tab was selected`);
    //     this.setState({setSelectedValue:data.value});
    //   };
     handleTabClick = (item?: PivotItem): void => {
        if (item) {
          // Simulate dynamic content loading based on tab selection
          if (item.props.itemKey === 'tab1') {
            
            //setContent('Content for Tab 1');
          } else if (item.props.itemKey === 'tab2') {
            this.setState({content:"Content from Tab2"});
            //setContent('Content for Tab 2 - Loaded dynamically');
          } else {
            this.setState({content:"Content from Tab3"});
          }
        }
      };
    clearSuccessMessage = () => {
        this.setState({ successMessage: '' });
    };
    clearSuccessupdateMessage = () => {
        this.setState({ successupdateMessage: '' });
      }
    handleOkButtonClick = () => {
        this.clearSuccessMessage();
        this.setState({ showPopup: false });
        this.toggleForm();
    };
    handleUpdateButtonClick = () => {
        this.clearSuccessupdateMessage();
        this.setState({ showPopup: false });
        //this.toggleForm();
      };

    public render(): React.ReactElement<ISuotProps> {
        const { showPopup } = this.state;

        return (
          
            <div>
                {/* <PrimaryButton onClick={this.toggleForm}>New</PrimaryButton> */}
               
                {/* this.renderForm()}
                {this.renderSuccessMessage()} 
                {this.renderSuccessUpdateMessage()*/}
            
                  <Pivot onLinkClick={this.handleTabClick}>
        <PivotItem headerText="Reports" itemKey="Reports">
          <div>Power Bi Report developement is inprogress</div>
        </PivotItem>
        <PivotItem headerText="Schedule/UnScheduled Overtime" itemKey="Schedule/UnScheduled Overtime">
          <div>
          <Modal isOpen={showPopup} isBlocking={true}
                 onDismiss={this.toggleForm}>
                 {this.renderForm()}
                 </Modal>
            {this.schedule()}</div>
        </PivotItem>
        <PivotItem headerText="Overtime Availability" itemKey="Overtime Availability">
        <div>
        <Modal isOpen={showPopup} isBlocking={true}
                 onDismiss={this.toggleForm}>
            
        {this.renderOTForm()}
        </Modal>
            {this.OT()}
        </div>
        </PivotItem>
        <PivotItem headerText="User Management" itemKey="User Management">
          <div>Content from User Management</div>
        </PivotItem>
      </Pivot>

            </div>
         
          
        );
    }

}






