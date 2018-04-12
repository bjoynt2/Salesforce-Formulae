/* 
    This file contains salesforce formula fields authored by Brian Joynt
*/

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
