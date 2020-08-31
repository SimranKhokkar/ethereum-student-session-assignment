const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));

const contractPath = path.join(__dirname, '../contractAddress.json');
const source = jsonfile.readFileSync(contractPath);
const allContract = source['Session'];
const myContract = web3.eth.contract(allContract.abi).at(allContract.address);
const address = path.join(__dirname, '../sessionData.json');

/**
 * Function to write new student data to the file
 * @param {Object} studentDetails
 */
const writeInFile = (studentDetails) => {
    try {
        let studentAddresses = jsonfile.readFileSync(address);
        if (studentAddresses.Students) {
            studentAddresses.Students.push(studentDetails);
        }
        else {
            studentAddresses['Students'] = [studentDetails];
        }
        fs.writeFileSync(address, JSON.stringify(studentAddresses, null, 4), { spaces: 2 });
    }
    catch (err) {
        console.log('Write operation to file could not be successful');
    }
};

/**
 * Function to write new student data to the file
 * @param {Object} studentDetails
 */
const fetchStudentAddress = (email) => {
    let studentAddresses = jsonfile.readFileSync(address);
    if(studentAddresses.Students) {
       return studentAddresses["Students"].find((item) => {
            if(item.email === email) {
                return item;
            }
       });
    }
};

const appController = {
/**
 * Function to write new student data to the file
 * @param {Object} studentDetails
 */
registerStudent: (studentDetails) => {
        return new Promise((resolve, reject) => {
            const accountAddress = web3.personal.newAccount(studentDetails.password);
            web3.personal.unlockAccount(accountAddress, studentDetails.password, 500);
            myContract.enterStudent(studentDetails.name, studentDetails.email, { from: accountAddress }, (err, res) => {
               if(err) {
                console.log('ERROR', err);
                reject(err);
               }
               else {
                   let studentData = {
                       address: accountAddress,
                       name: studentDetails.name, email: studentDetails.email
                   };
                writeInFile(studentData);
                resolve('success');
               }
            });
        });
},

/**
 * Function to get list of all students
 */
getAllStudents: () => {
    return new Promise((resolve, reject) => {
       myContract.NewStudent({}, { fromBlock: 0, toBlock: 'latest'}).get((err, res) => {
            if (err) {
                console.log('get all students', err);
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
},

/**
 * Function to add student's feedback
 * @param {Object} feedbackDetails
 */
giveSessionFeedback: (feedbackDetails) => {
    return new Promise((resolve, reject) => {
        const student = fetchStudentAddress(feedbackDetails.email);
        web3.personal.unlockAccount(student.address, feedbackDetails.password, 500);
        myContract.giveFeedback(feedbackDetails.knowledgeOfInstructor, feedbackDetails.durationOfSession, feedbackDetails.informationSharing, feedbackDetails.sessionContent, feedbackDetails.overallExperience, { from: student.address }, (err, res) => {
            if (err) {
                console.log('error while giving feedback', err);
                reject(err);
            }
            else {
                resolve('success');
            }
        });
    });
},

/**
 * Function to get all the feedbacks given by students
 */
getAllFeedbacks: () => {
    return new Promise((resolve, reject) => {
        myContract.NewFeedback({}, {fromBlock: 0, toBlock: 'latest'}).get((err, res) => {
            if(err) {
                console.log('event for new feedback', err);
                reject(err);
            }
            else {
                console.log('result of event new feedback', res);
                resolve(res);
            }
        });
    });
},

/**
 * Function to pay the instructor for the session
 */
payInstructor: () => {
    return new Promise ((resolve, reject) => {
        myContract.pay({from: myContract.organizer.call()}, (err,res) => {
            if(err) {
                console.log('error while paying', err);
                reject(err);
            }
            else {
                fs.writeFileSync(address, JSON.stringify({}, null, 4), { spaces: 2 });
                resolve('success');
            }
        });
    });
},

/**
 * Function to open the feedback form for students
 */
openFeedbackForm: () => {
    return new Promise((resolve, reject) => {
        myContract.openFeedbackForm({from: myContract.organizer.call()},(err,res) => {
            if(err) {
                console.log('error while opening feedback form', err);
                reject(err);
            }
            else{
                resolve('success');        
            } 
        });
    });
},

/**
 * Function to get the total number of students
 */
getTotalStudents: () => {
    return new Promise((resolve, reject) => {
        try {
        let totalStudents = myContract.totalStudents.call();
        resolve(totalStudents.c);
        }
        catch(err){
            reject(err);
        }
    });
},

/**
 * Function to get a particular student's data
 * @param {String} email
 */
getStudentData: (email) => {
    return new Promise((resolve, reject) => {
        try {
        let student = fetchStudentAddress(email);
        let studentData = myContract.Students.call(student.address);
        resolve(studentData);
        }
        catch(err){
            reject(err);
        }
    });
},

/**
 * Function to get the average rating given by the students
 */
getAverage: () => {
    return new Promise((resolve, reject) => {
        try {
        let average = myContract.average.call();
        resolve(average.c);
        }
        catch(err){
            reject(err);
        }
    });
},

/**
 * Function to get the total amount given by the organizer
 */
getTotalAmount: () => {
    return new Promise((resolve,reject) => {
        try {
            let totalAmount = myContract.totalAmount.call();
            resolve(totalAmount.c);
            }
            catch(err){
                reject(err);
            }
    });
},

/**
 * Function to get the value of feedback flag from contract
 */
getFeedbackFlag: () => {
    return new Promise((resolve, reject) => {
        try{
            let flag = myContract.feedbackFlag.call();
            resolve(flag);
        } catch (err) {
            reject(err);
        }
    });
}
};


module.exports = appController;