pragma solidity ^0.4.18;

/**
Contract to:
store student's data
give feedback for session
pay the instructor
*/
contract Session {
    address public organizer;
    address public instructor;
    bool public feedbackFlag;
    uint public average;
    uint public totalAmount;
    uint public totalStudents;
    struct Feedback {
        uint knowledgeOfInstructor;
        uint durationOfSession;
        uint informationSharing;
        uint sessionContent;
        uint overallExperience;
  }

    struct Student {
        address studentAddress;
        string name;
        string email;
        Feedback feedback;
  }
    mapping(address => Student) public Students;
    event NewStudent(address indexed studentAddress, string email, string name);
    event NewFeedback(address studentAddress, uint averageRating);

/**
constructor
 */
    constructor(address instructorAddress) public payable {
        organizer = msg.sender;
        totalAmount = msg.value;
        feedbackFlag = false;
        totalStudents = 0;
        instructor = instructorAddress;
     }

/**
register a new student for the session
*/
  function enterStudent(string name, string email) public newRegistration {
    Student memory newStudent = Student(msg.sender, name, email, Feedback(0,0,0,0,0));
    Students[msg.sender] = newStudent;
    totalStudents++;
    emit NewStudent(msg.sender, email, name);
    }

/**
function to pay the instructor once the session is over
Only organizer can invoke the function
*/
  function pay() public payable organizerAuthentication {
      uint averageRating = average / totalStudents;
      uint amountToBePaid = (totalAmount / 5) * averageRating;
      instructor.transfer(amountToBePaid);
  }

/**
function for student to give feedback
*/

  function giveFeedback(uint knowledgeOfInstructor, uint durationOfSession, uint informationSharing, uint sessionContent, uint overallExperience) public  studentAuthentication returns(bool) {
      if(feedbackFlag == true){
      Students[msg.sender].feedback.knowledgeOfInstructor = knowledgeOfInstructor;
      Students[msg.sender].feedback.durationOfSession = durationOfSession;
      Students[msg.sender].feedback.informationSharing = informationSharing;
      Students[msg.sender].feedback.sessionContent = sessionContent;
      Students[msg.sender].feedback.overallExperience = overallExperience;
      uint averageRating = (knowledgeOfInstructor + durationOfSession + informationSharing + sessionContent + overallExperience) / 5;
      average = average + averageRating;
      emit NewFeedback(msg.sender, averageRating);
      return true;
      }
      else {
          return false;
      }
  }

  /**
  function to open the feedback form for the student
  Only organizer can open the feedback form
  */
  function openFeedbackForm() public organizerAuthentication {
      feedbackFlag = true;
  }
  
  /**
  Modifier to check if sender is organizer
  */
  modifier organizerAuthentication() {
      require(msg.sender == organizer, 'Only organizer can take this action');
      _;
  }

  /**
  Modifier to check if sender is student
  */
  modifier studentAuthentication() {
      require(Students[msg.sender].studentAddress == msg.sender, 'Authentication Error: Student does not exist');
      _;
  }

  /**
  Modifier to check if student exists
  */
  modifier newRegistration() {
      require(Students[msg.sender].studentAddress != msg.sender, 'Student already exists');
      _;
  }
}