/* 
    This file contains salesforce formula fields authored by Brian Joynt
*/
    Data Model	
    http://www.salesforce.com/us/developer/docs/api/Content/data_model.htm

//Fletcher Aluminium Opportunity Fields

--
    // Key Reporting Metrics Using Formula Fields
 --   
    Quoted__c	
    IF(LEN(Quote__c)>0,1,0)
     
    Sum of Unquoted                     IF( Quoted__c =0,1,0)
    Sum of Unquoted Won                 IF(AND(Quoted__c=0, ISPICKVAL(StageName, "Closed Won")), 1,0)
    Sum of Unquoted Won Value           IF(AND(Quoted__c=0, ISPICKVAL(StageName, "Closed Won")), Custom_Amount__c + BLANKVALUE(Upsell_Amount__c, 0) ,0)
    Sum of Quoted Number                IF(LEN(Quote__c)>0,1,0)
    Sum of Quoted Won                   IF(AND(Quoted__c=1, ISPICKVAL(StageName, "Closed Won")), 1,0)
    Sum of Quoted Value                 IF(Quoted__c=1,Custom_Amount__c + BLANKVALUE(Upsell_Amount__c, 0),0)
    Sum of Quoted Won Value             IF(AND(Quoted__c=1, ISPICKVAL(StageName, "Closed Won")), Custom_Amount__c + BLANKVALUE(Upsell_Amount__c, 0) ,0)
    Sum of Quotes Pending               IF(AND( Quoted__c=1, NOT(ISPICKVAL(StageName, "Closed Won")), NOT(ISPICKVAL(StageName, "Closed Lost"))), Quoted__c ,0)
    Sum of Quotes Pending Value         IF(AND( Quoted__c=1, NOT(ISPICKVAL(StageName, "Closed Won")), NOT(ISPICKVAL(StageName, "Closed Lost"))), Custom_Amount__c + BLANKVALUE(Upsell_Amount__c, 0) ,0)
    Sum of Quotes Lost                  IF(AND( Quoted__c=1, ISPICKVAL(StageName, "Closed Lost")), Quoted__c ,0)
    Sum of Quotes Lost Value            IF(AND( Quoted__c=1, ISPICKVAL(StageName, "Closed Lost")), Custom_Amount__c + BLANKVALUE(Upsell_Amount__c, 0) ,0)
    Sum of Opportunity Duration         IF(AND( ISPICKVAL(StageName,"Closed Won"), CloseDate > DATEVALUE(CreatedDate)) ,CloseDate - DATEVALUE(CreatedDate) ,0)
    Hit Rate Value                      IF(Opportunity.Quoted_Value__c:SUM=0,0,Opportunity.Quoted_Won_Value__c:SUM/Opportunity.Quoted_Value__c:SUM)                   
    Hit Rate Count                      IF(Opportunity.Quoted__c:SUM=0,0,Opportunity.Quoted_Won__c:SUM/Opportunity.Quoted__c:SUM)
    TOTAL REVENUE WON                   Opportunity.Unquoted_Won__c:SUM+Opportunity.Quoted_Won_Value__c:SUM
    Avg Duration Won                    IF(Opportunity.Opportunity_Duration__c:SUM <> 0,Opportunity.Opportunity_Duration__c:SUM/Opportunity.Quoted_Won__c:SUM,0)
    Record Count

--
    Closed Won Amount	
    IF( ISPICKVAL(StageName, "Closed Won"), Amount, 0)
--
    Delivery Days	//Agreed Delivery -> Actual Delivery = 0 days
    (5 * ( FLOOR( ( Actual_Delivery__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Actual_Delivery__c - DATE( 1900, 1, 8), 7 ) ) ) 
    - 
    (5 * ( FLOOR( ( Job_Completed__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Job_Completed__c - DATE( 1900, 1, 8), 7 ) ) )
--
    Delivery Due Date	
    Agreed_Delivery__c
--
    Delivery Ex Factory Image	
    IF( Delivery_Ex_Factory__c = false, IMAGE("https://c.na1.content.force.com/servlet/servlet.FileDownload?file=01530000002QmLG", "checkbox", 14, 14),IMAGE("https://c.na1.content.force.com/servlet/servlet.FileDownload?file=01530000002QmLB", "checkbox", 14, 14))
--
    Delivery Overdue Days
    /*Actual_Delivery__c is null, today-expect due date; Actual_Delivery__c - expect due date*/ 
        IF( ISNULL(Actual_Delivery__c), TODAY()-Delivery_Due_Date__c, 
            /*Actual_Delivery__c is larger than Delivery_Due_Date__c*/ 
            IF( Actual_Delivery__c - Agreed_Delivery__c < 0, 0,	
            /*Delivery_Weekdays__c has overdue*/ 
            IF ( Delivery_Weekdays__c < 0, 0, Actual_Delivery__c - Delivery_Due_Date__c 
            ) 
        )	
    ) 
    /* 
    if you need to cater for working days 
    (5 * ( FLOOR( ( Actual_Delivery__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Actual_Delivery__c - DATE( 1900, 1, 8), 7 ) ) ) 
    - 
    (5 * ( FLOOR( ( Site_Measure_Completion_Date__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Site_Measure_Completion_Date__c - DATE( 1900, 1, 8), 7 ) ) )+1 
    */	
--
    Delivery Service //0:Green;1-2:Yellow;Else:Red	
    IMAGE( 
        CASE( IF(ISNULL( Agreed_Delivery__c ) || ISNULL( Actual_Delivery__c ) || Delivery_Weekdays__c <0,-1,Delivery_Weekdays__c) , 
        -1,"img/alohaSkin/help_orange.png", 
        0, "img/samples/light_green.gif", 
        1, "img/samples/light_yellow.gif", 
        2, "img/samples/light_yellow.gif", 
        "img/samples/light_red.gif"), 
        "" 
        )
--
    Deposit Balance	
    Sell_Price_Inc_GST__c - Deposit_Required__c
--
    Disable Multiple Attachments
    IF( $User.Disable_Multiple_Attachments__c , "TRUE", "FALSE")
--
    End Date	
    CloseDate
--
    Expired
    IMAGE(IF(CloseDate < TODAY()&& 
    NOT(IsClosed), "/img/samples/flag_red.gif","/s.gif"), "")
--   
    Expired Flag	
    IF(CloseDate < TODAY()&& NOT(IsClosed), "Yes","No")
--
    Factory Hours Remaining	
    Factory_Hours_Budget__c - Factory_Hours_Actual__c
--
    Factory HRS	//Factory Minutes expressed in HRS (Factory HRS / 60) if you enter minutes in the Factory HRS Field
    IF(Factory_HRS__c <> 0,Factory_HRS__c / 60,0)
--
    Garage or Aluminium	
    IF( ISPICKVAL( Product_Brands__c , "Garage Doors"),"Garage Doors" ,"Aluminium")
--
    Garages and Flyscreens	
    IF( OR(ISPICKVAL( Product_Brands__c , "Garage Doors"),ISPICKVAL( Product_Brands__c , "Flyscreen/Security")), TEXT(Product_Brands__c) ,"Aluminium")
--
    GM Less Install %	
    IF(Custom_Amount__c>0,GM_Less_Install__c / Custom_Amount__c,0)
--
    Gross Margin $	
    Amount - Cost__c
--
    Gross Margin %	
    IF(Amount > 0,(Amount - Cost__c) / Amount,0)
--   
    Gross Margin Less Install Costs	
    Gross_Margin__c - Install_Costs__c
--
    GST
    Amount * 0.15
--
    Install Hours Over	
    IMAGE( 
        CASE( IF( Install_Hours_Remaining__c <0, -1, 1) , 
        -1,"img/samples/flag_red.gif", 
        1, "img/samples/flag_green.gif", 
        "img/samples/flag_red.gif"), 
        "" 
        )
--
    Install Hours Remaining	
    Install_Hours_Budget__c - Install_Hours_Actual__c
--
    Job Completed Days //Site Measure Done -> Job Completed = 15 days
    (5 * ( FLOOR( ( Job_Completed__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
        Job_Completed__c - DATE( 1900, 1, 8), 7 ) ) ) 
    - 
    (5 * ( FLOOR( ( Job_Sent__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Job_Sent__c - DATE( 1900, 1, 8), 7 ) ) )   
--
    Job Completed Due Date	
    CASE(MOD(Site_Measure_Completion_Date__c - DATE( 1900, 1, 7 ), 7 ), 
    0, Site_Measure_Completion_Date__c + 1 + 4 + 2 + 5 + 5 + 2, /* Sun: Site Measure Done + 1 wknd day + 15 days */ 
    1, Site_Measure_Completion_Date__c + 4 + 2 + 5 + 5 + 2, /* (Mon): Site Measure Done + 15 days */ 
    Site_Measure_Completion_Date__c + 2 + 4 + 2 + 5 + 5 + 2 /* Default (Tues/Wed/Thurs/Fri/Sat): Site Measure Done + 15 days */ 
    )
--
    Job Sent Service	
    IMAGE( 
        CASE( IF( Job_Sent_Days__c <1,0,Job_Sent_Days__c ) , 
        0, "img/alohaSkin/help_orange.png", 
        1, "img/samples/light_green.gif", 
        2, "img/samples/light_green.gif", 
        3, "img/samples/light_green.gif", 
        4, "img/samples/light_green.gif", 
        5, "img/samples/light_yellow.gif", 
        "img/samples/light_red.gif"), 
        "" 
    )
--
    Job From Rylock	//Rylock Assigned this Job to Nebulite
    IF( Assigned_To_Nebulite__c = TRUE, TRUE, FALSE)
--
    Job Sent Days	//Site Measure Done -> Job Sent = 4 days
    (5 * ( FLOOR( ( Job_Sent__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
        Job_Sent__c- DATE( 1900, 1, 8), 7 ) ) ) 
        - 
    (5 * ( FLOOR( ( Site_Measure_Completion_Date__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD( 
    Site_Measure_Completion_Date__c - DATE( 1900, 1, 8), 7 ) ) )
--
    Job Sent Due Date	//Site Measure Done + 4 Days
    CASE( MOD( Site_Measure_Completion_Date__c - DATE( 1900, 1, 7 ), 7 ), 
    0, Site_Measure_Completion_Date__c + 2 + 1 + 1, /* Sun: Site_Measure_Completion_Date__c + 1 wknd day + 4 days CORRECT */ 
    1, Site_Measure_Completion_Date__c + 2 + 1, /* (Mon): Site_Measure_Completion_Date__c + 4 days */ 
    2, Site_Measure_Completion_Date__c + 2 + 1, /* (Tue): Site_Measure_Completion_Date__c + 4 days */ 
    Site_Measure_Completion_Date__c + 2 + 2 + 1/* Default (Wed/Thurs/Fri/Sat): Site_Measure_Completion_Date__c + 4 days */ 
    )
--
    Job Sent Service
    IMAGE( 
        CASE( IF( Job_Sent_Days__c <1,0,Job_Sent_Days__c ) , 
        0, "img/alohaSkin/help_orange.png", 
        1, "img/samples/light_green.gif", 
        2, "img/samples/light_green.gif", 
        3, "img/samples/light_green.gif", 
        4, "img/samples/light_green.gif", 
        5, "img/samples/light_yellow.gif", 
        "img/samples/light_red.gif"), 
        "" 
        )	
--
    Lead Creation Date	
    Converted_From__r.CreatedDate
--
    Lead to Quote Duration	
    IF(DATEVALUE(TEXT(Lead_Creation_Date__c)) <= Quote_Sent_Date__c, ROUND(Quote_Sent_Date__c - DATEVALUE(TEXT(Lead_Creation_Date__c)),0),0)
--
    MGH Overall Workdays //From Quote Request --> Actual Delivery
    (5 * ( FLOOR( ( Actual_Delivery__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD(Actual_Delivery__c - DATE( 1900, 1, 8), 7 ) ) ) 
    - 
    (5 * ( FLOOR( ( Quote_Request__c - DATE( 1900, 1, 8) ) / 7 ) ) + MIN( 5, MOD(Quote_Request__c - DATE( 1900, 1, 8), 7 ) ) )
--

//more to be added here


// Fletcher Aluminium Account Fields

    Search Companies Office	
    http://www.business.govt.nz/companies/app/ui/pages/companies/search?mode=standard&type=entities&q={!IF(LEN( Account.Account_Legal_Name__c )>0, Account.Account_Legal_Name__c , Account.Name )}
--
    Current 18 ID	
    CASESAFEID( Id )
--
    Data Quality Description	
    IF( Data_Quality_Score__c =100,"All Account Details Captured", "Missing: "&IF( ISPICKVAL( Industry,""),"Industry, ","")&""&IF(ISPICKVAL(Rating,""), "Rating, ","")&""&IF( LEN(BillingCity) = 0, "Complete Address, ","")&""&IF( LEN(Phone) = 0, "Phone, ","")&""&IF( ISPICKVAL(Type,""), "Type",""))
--
    Data Quality Score	
    IF( ISPICKVAL(Industry,""), 0,20) + IF( ISPICKVAL(Rating,""), 0,20) + IF( LEN(BillingCity) = 0, 0,20) + IF(LEN(Phone) = 0, 0,20) + IF( ISPICKVAL(Type,""), 0,20)
--
    IF
    IF( IFOTIS_Lines__c <>0, In_Full_Pass__c/IFOTIS_Lines__c,0)
--
    IFOTIS
    IF( IFOTIS_Lines__c <>0, IFOTIS_Passed__c/IFOTIS_Lines__c,0)
--
    IS
    IF( IFOTIS_Lines__c <>0, In_Spec_Pass__c /IFOTIS_Lines__c,0)
--
    Manual Invoice Summary	
    "Narration: " & Narration__c & BR() & 
    "Cost Code: " & TEXT(Cost_Centre_Code__c ) & BR() & 
    "Value: $" & TEXT(Value__c )
--
    Movex Customer	
    M3_CUNO__c & " - " & Account_Legal_Name__c & " | " & Name
--
    OT
    IF( IFOTIS_Lines__c <>0, On_Time_Pass__c /IFOTIS_Lines__c,0)
--
    PA Contact FirstName	    
    Primary_Contact__r.FirstName
--
    PA Contact LastName	
    Primary_Contact__r.LastName
--
    Primary Contact Email	
    Primary_Contact__r.Email
--
    Primary Contact Full Name	
    Primary_Contact__r.FirstName & " " & Primary_Contact__r.LastName
--
    Primary Contact Mobile	
    Primary_Contact__r.MobilePhone
--
    Primary Contact Phone	
    Primary_Contact__r.Phone
--
    Quoted Rate	
    IMAGE("http://chart.apis.google.com/chart?cht=p3&chd=t:" & 
    Text(Pending__c/(Quoted__c - Pending__c)) & "," & 
    Text((Quoted__c - Pending__c)/Quoted__c) & 
    "&chs=275x100&chf=bg,s,F3F3EC&chl=Pending|Quoted&chco=5555ff", 
    "chart text")
--
    Start Address	
    IF(LEN( $User.Address__c )>0,$User.Address__c,"")
--
    User Company Name	
    Owner.CompanyName
--
    Win Rate	
    IMAGE("http://chart.apis.google.com/chart?cht=p3&chd=t:" & 
    Text(Won__c/(Won__c + Lost__c)) & "," & 
    Text(Lost__c/(Won__c + Lost__c)) & 
    "&chs=275x100&chf=bg,s,F3F3EC&chl=Won|Lost&chco=5555ff", 
    "chart text")


// Fletcher Living Maintenance

    % Complete	
    IF(Maintenance_Items__c<>0,Maintenance_Items_Complete__c / Maintenance_Items__c ,0)
--   
    Completed
    IF( ISPICKVAL(Status__c, "Complete"),true,false)
--
    Duration
    IF( LEN(TEXT(Date_Completed__c))>0, Date_Completed__c - Date_Entered__c,0)
--
    Expired
    IF( Expired_Check__c = true, IMAGE("/img/samples/flag_red.gif", "expired" ),"")
--
    Expired Check	
    IF( Due_Date__c < TODAY() && NOT( ISPICKVAL(Status__c,"Complete")),true,false)
--
    My Job	
    IF( $User.FirstName + ' ' + $User.LastName = Assigned_To__r.Name, true,false)
 --   
    Primary Contact	
    Property_Owner__r.First_Name_pc__c & " " & Property_Owner__r.Last_Name_pc__c 
    & 
    IF(LEN(Property_Owner__r.Email_pc__c)>1, " Email: " & 
    Property_Owner__r.Email_pc__c , "") 
    & 
    IF(LEN(Property_Owner__r.Mobile_pc__c)>1, " Mob: " & 
    Property_Owner__r.Mobile_pc__c, "") 
    & 
    IF(Property_Owner__r.Secondary_Contact__c = TRUE, " " & BR() & "Secondary Contact: " & Property_Owner__r.First_Name_sc__c & " " & Property_Owner__r.Last_Name_sc__c, "") 
    & 
    IF(LEN(Property_Owner__r.Email_sc__c)>1, " Email: " & 
    Property_Owner__r.Email_sc__c , "") 
    & 
    IF(LEN(Property_Owner__r.Mobile_sc__c)>1, " Mob: " & 
    Property_Owner__r.Mobile_sc__c, "")
--
    Primary Contact1	
    Property_Owner__r.First_Name_pc__c & " " & Property_Owner__r.Last_Name_pc__c 
    & 
    IF(LEN(Property_Owner__r.Phone)>1, " Phone: " & 
    Property_Owner__r.Phone, "") 
    & 
    IF(LEN(Property_Owner__r.Mobile_pc__c)>1, " Mob: " & 
    Property_Owner__r.Mobile_pc__c, "") 
    & 
    IF(Property_Owner__r.Secondary_Contact__c = TRUE, " " & BR() & "Secondary Contact: " & Property_Owner__r.First_Name_sc__c & " " & Property_Owner__r.Last_Name_sc__c, "") 
    & 
    IF(LEN(Property_Owner__r.Phone_sc__c)>1, " Phone: " & 
    Property_Owner__r.Phone_sc__c, "") 
    & 
    IF(LEN(Property_Owner__r.Mobile_sc__c)>1, " Mob: " & 
    Property_Owner__r.Mobile_sc__c, "")
--
    PropertyAccountID
    Property__r.Account__r.Id
--
    Property Full Address	
    IF( LEN(Property__r.Address__c) > 0 , Property__r.Address__c , Property__r.Lot__c )
--
    Record URL	
    LEFT($Api.Partner_Server_URL_370, FIND( '/services', $Api.Partner_Server_URL_260))&Id
--
    View PDF	
    HYPERLINK("/apex/maintenance_jobcardPDF?id=" & Id, "View")

// Fletcher Living Property Formula Fields 

    2 Months After Settlement	
    Settlement_Date__c +60
--
    2 Weeks After Settlement	
    IF( ISBLANK(Survey_Date__c), Settlement_Date__c +14, null)
--
    4 Months After Settlement	
    IF( ISBLANK(Maintenance_Survey_Date__c), Settlement_Date__c + 120, null)
--
    Area
    TEXT(Location__r.Area__c)
--
    Julian Master Build Guarantee Date Con	
    DATE( VALUE (((MID( Julian_Master_Build_Guarantee_Date__c ,2,2)))) + 2000 , 1, 1) + (VALUE (RIGHT( Julian_Master_Build_Guarantee_Date__c , 3)) - 1)
--
    Julian Month to Profit Date Converted	
    DATE( VALUE (((MID( Julian_Month_to_Profit_Date__c ,2,2)))) + 2000 , 1, 1) + (VALUE (RIGHT( Julian_Month_to_Profit_Date__c , 3)) - 1)
--
    Julian Settlement Date Converted	
    DATE( VALUE (((MID( Julian_Settlement_Date__c ,2,2)))) + 2000 , 1, 1) + (VALUE (RIGHT( Julian_Settlement_Date__c , 3)) - 1)
--
    Julian Unconditional Date Converted	
    DATE( VALUE (((MID( Julian_Unconditional_Date__c,2,2)))) + 2000 , 1, 1) + (VALUE (RIGHT( Julian_Unconditional_Date__c, 3)) - 1)
--
    Map Address	
    IF(LEN(Address__c)>0,Address__c,"New Zealand")
--
    Primary Contact	
    Account__r.First_Name_pc__c & " " & Account__r.Last_Name_pc__c 
    & 
    IF(LEN(Account__r.Email_pc__c)>1, " Email: " & 
    Account__r.Email_pc__c , "") 
    & 
    IF(LEN(Account__r.Phone)>1, " Phone: " & 
    Account__r.Phone, "") 
    & 
    IF(LEN(Account__r.Mobile_pc__c)>1, " Mob: " & 
    Account__r.Mobile_pc__c, "")
--
    Surveyed for Sales?	
    AND( NOT(ISBLANK(Survey_Date__c )), YEAR(Survey_Date__c) >= 2016)


// Fletcher Living Visitor Metric Formula Fields 

    Days Since Visit	
    TODAY()- ActivityDate
--
    Day of the week	
    IF( Monday_to_Friday__c =1,"MON to FRI","") & IF( Saturday__c =1,"SAT","") & IF( Sunday__c =1,"SUN","")
--
    Weekday
    CASE(MOD( ActivityDate - DATE(1900, 1, 6), 7), 
    0, "Saturday", 
    1, "Sunday", 
    2,"Monday", 
    3, "Tuesday", 
    4, "Wednesday", 
    5, "Thursday", 
    6,"Friday"
    ,"")
--
    Monday to Friday	
    IF( OR(Weekday__c ="Saturday",Weekday__c ="Sunday") , 0,1)
--
    Saturday
    IF( Weekday__c ="Saturday", 1, 0)
--
    Sunday
    IF( Weekday__c ="Sunday", 1, 0)

// Fletcher Living Sales and Budgets

    Current Fiscal Period	    
    IF( (MONTH( DATEVALUE(NOW()) ) >= 7 && MONTH(DATEVALUE(NOW()) ) <= 12), 
    TEXT (YEAR(DATEVALUE(NOW()))) & "/" & RIGHT ( TEXT (YEAR(DATEVALUE(NOW()))+ 1), 4) , 
    TEXT (YEAR(DATEVALUE(NOW()))-1) & "/" & RIGHT (TEXT (YEAR(DATEVALUE(NOW()))), 4) 
    )
--
    Fiscal Period	
    IF( (MONTH(Date__c ) >= 7 && MONTH(Date__c ) <= 12), 
    TEXT (YEAR(Date__c)) & "/" & RIGHT ( TEXT (YEAR(Date__c)+ 1), 4) , 
    TEXT (YEAR(Date__c)-1) & "/" & RIGHT (TEXT (YEAR(Date__c)), 4) 
    )
--
    Match
    IF( Current_Fiscal_Period__c = Fiscal_Period__c , TRUE, FALSE)
--
    Period
    TEXT(YEAR (Date__c) ) 
    & ("-") & 
    CASE(MONTH (Date__c) , 
    1, "01", 
    2, "02", 
    3, "03", 
    4, "04", 
    5, "05", 
    6, "06", 
    7, "07", 
    8, "08", 
    9, "09", 
    10, "10", 
    11, "11", 
    12, "12", 
    NULL)
--
    Sale
    IF( CONTAINS(RecordType.DeveloperName,"Sale"), Total__c , 0)
--
    Target
    IF( CONTAINS(RecordType.DeveloperName,"Target"), Total__c , 0)

// Activity Fields

    Period
    TEXT(YEAR ( ActivityDate ) ) 
    & ("-") & 
    CASE(MONTH (ActivityDate) , 
    1, "01", 
    2, "02", 
    3, "03", 
    4, "04", 
    5, "05", 
    6, "06", 
    7, "07", 
    8, "08", 
    9, "09", 
    10, "10", 
    11, "11", 
    12, "12", 
    NULL)
