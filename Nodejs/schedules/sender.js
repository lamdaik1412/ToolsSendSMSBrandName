const axios = require('axios');
const { DOMParser } = require('xmldom');
const { SMS_LayDanhSach_LichGui, SMS_Luu_Log } = require('../data/storedProcedure');
const logger = require('../utils/logger');

const API_SMS = process.env.API_SMS;

function buildXmlParameter(parameter, number) {
    return `<PARAMS>
        <NUM>${number + 1}</NUM>
        <CONTENT>${parameter}</CONTENT>
    </PARAMS>`;
}
function buildXmlRequest(config) {
    const stringParameters = config.PARAMS.split(',');
    const stringXML = stringParameters.map((parameter, number) => buildXmlParameter(config[parameter], number)).join('');

    return `<RQST>
        <name>send_sms_list</name>
        <REQID></REQID>
        <LABELID>${config.LABELID}</LABELID>
        <CONTRACTID>${config.CONTRACTID}</CONTRACTID>
        <CONTRACTTYPEID>${config.CONTRACTTYPEID}</CONTRACTTYPEID>
        <TEMPLATEID>${config.TEMPLATEID}</TEMPLATEID>
        ${stringXML}
        <SCHEDULETIME></SCHEDULETIME>
        <MOBILELIST>${config.sdt}</MOBILELIST>
        <ISTELCOSUB>${config.ISTELCOSUB}</ISTELCOSUB>
        <AGENTID>${config.AGENTID}</AGENTID>
        <APIUSER>${config.APIUSER}</APIUSER>
        <APIPASS>${config.APIPASS}</APIPASS>
        <USERNAME>${config.USERNAME}</USERNAME>
        <DATACODING>${config.DATACODING}</DATACODING>
    </RQST>`;
}

async function sendSMS(patient, unitID) {
    try {
        const xml = buildXmlRequest(patient);
        const response = await axios.post(API_SMS, xml, { 'Content-Type': 'application/xml' });
        const responseData = response.data;

        logger.info(`Response data ${patient.hoten}: ${responseData}`);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseData, 'text/xml');
        const errorCode = xmlDoc.getElementsByTagName('ERROR')[0].textContent;
        const errorDescription = xmlDoc.getElementsByTagName('ERROR_DESC')[0].textContent;

        await SMS_Luu_Log(`${unitID}`, xml, errorDescription, patient.sdt, patient.myt, `${errorCode}`, patient.id);
    } catch (error) {
        await SMS_Luu_Log(`${unitID}`, xml, error, patient.sdt, patient.myt, '', patient.id);
    }
}

async function SendSMSMessages(unitID) {
    try {
        const patientList = await SMS_LayDanhSach_LichGui(unitID) || [];

        for (const patient of patientList) {
            await sendSMS(patient, unitID);
        }
    } catch (error) {
        // Handle any errors here
        logger.error(error);
    }
}

module.exports = { SendSMSMessages }