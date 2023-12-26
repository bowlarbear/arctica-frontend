import { createStore } from 'vuex'

export default createStore({
    //some of these are currently hardcoded for testing, but should eventually all be undefined, false, null or empty and obtained dynmically from backend
    state: {
    //the device number of the currently inserted wallet
    currentHW: 0,
    //this state designates whether a wallet should boot to dashboard or be treated as an offline only signing card
    hotHW: false,
    //a current HW of 0 designates no inserted Hardware Wallet
    setupCD: false,
    //setupStep variables 
    // setupStep 1 placed on HW 1 at step 4 to jump user to step 12 
    // setupStep 2 placed on HW 2 at step 5 to jump user to step 14 
    // setupStep 3 placed on HW 3 at step 6 to jump user to step 15 
    // setupStep 4 placed on HW 4 at step 7 to jump user to step 16 
    // setupStep 5 placed on HW 5 at step 8 to jump user to step 17 
    // setupStep 6 placed on HW 6 at step 9 to jump user to step 19 
    // setupStep 7 placed on HW 7 at step 10 to jump user to step 20
    // setupStep 8 placed on HW 1 at step 12 to jump user to step 21 
    // setupStep 9 placed on HW 2 at step 14 to jump user to step 27a, last HW 2, setupStep set to 0 at step 29
    // setupStep 10 placed on HW 3 at step 15 to jump user to step 31a last HW 3, setupStep set to 0 at step 33 
    // setupStep 11 placed on HW 4 at step 17 to jump user to step 35a last HW 4, setupStep set to 0 at step 37 
    // setupStep 12 placed on HW 5 at step 18 to jump user to step 39a last HW 5, setupStep set to 0 at step 41 
    // setupStep 13 placed on HW 6 at step 19 to jump user to step 43a last HW 6, setupStep set to 0 at step 45 
    // setupStep 14 placed on HW 7 at step 20 to jump user to step 47a last HW 7, setupStep set to 0 at step 49a 
    //setupStep 99 is placed on a HW after restoring from a backup CD
    setupStep: 0,
    //setupStep is used as state between sessions and comes from the setup CD
    setupStage: 1,
    //setupStage is used as state for the progress bar component
    debug: [],
    showDebug: false,
    //debug is a print out of the debug console
    loadMessage: '',
    //load message is used to push live updates to the Loading Component
    errorMessage: '',
    //Error Message is used to display fatal errors on the Error page
    //post set up complete
    tripwireSetup: true, recoverySetup: true, duressSetup: true,
    //bootup checking for special conditions and allowing for login
    btcCoreHealthy:true, bpsHealthy:true, tripwireTripped:'none', timeMachineKeysFound:false, privacyKeysFound:false,
    bpsBricked: false,
    decrypted: false,
    //numberToRecover should eventually dynamically decay as privacy keys are published to the blockchain
    numberToRecover: 5,
    //data for creating a new Transaction
    address:[], balance:[], fiat_currency:null, datetime:null, fee:null, customFee:null, status: null, 
    //existing transaction history, placeholder hardcodes initiatilize as empty after backend hookup
    immediateTransactions: [],
    delayedTransactions: [],
    hotTransactions: [],
    //various wallet balances
    quickBalance: null,
    hotBalance: null,
    immediateBalance: 0,
    delayedBalance: 0,
    //delayed wallet timelocked
    timeLock: true,
    immediateDecay: false,
    delayedDecay: "zero", //this is a string to allow for a larger set of conditions than a boolean
    //delayedDecay is looking for either "zero", "one", "two", "three", "four", or "five" as an input.
    //if it is set to "zero" that means the delayed wallet is timelocked
    //if it is set to "one" that means the timelock has expired
    //if it is set to "two", "three", or "four" that means it is at various stages of theshold decay
    //if it is set to "five" that means that the delayed wallet has fully decayed down to a 1 of 7
    sysPass:"",
    deviceList: null,
    node: false,
    },
    mutations:{//synchronous, alters data in state (commit)
        setDebug(state, value){
            state.debug.push(value)
        },
        setShowDebug(state, payload){
            state.showDebug = payload
        },
        setLoadMessage(state, payload){
            state.loadMessage = payload
        },
        setErrorMessage(state, payload){
            state.errorMessage = payload
        },
        setHotTransactions(state, payload){
            state.hotTransactions = payload
        },
        setImmediateTransactions(state, payload){
            state.immediateTransactions = payload
        },
        pushImmediateTransaction(state, payload){
            state.immediateTransactions.push(payload)
        },
        pushHotTransaction(state, payload){
            state.hotTransactions.push(payload)
        },
        pushDelayedTransaction(state, payload){
            state.delayedTransactions.push(payload)
        },
        setDelayedTransactions(state, payload){
            state.delayedTransactions = payload
        },
        setHotBalance(state, payload){
            state.hotBalance = payload
        },
        setImmediateBalance(state, payload){
            state.immediateBalance = payload
        },
        setquickBalance(state, payload){
            state.quickBalance = payload
        },
        setDelayedBalance(state, payload){
            state.delayedBalance = payload
        },
        setBTCCoreHealthy(state, payload){
            state.btcCoreHealthy = payload
        },
        setBPSHealthy(state, payload){
            state.bpsHealthy = payload
        },
        setTripwireTripped(state, payload){
            state.tripwireTripped = payload
        },
        setTimeMachineKeysFound(state, payload){
            state.timeMachineKeysFound = payload
        },
        setPrivacyKeysFound(state, payload){
            state.privacyKeysFound = payload
        },
        setTimeLock(state, payload){
            state.timeLock = payload
        },
        setImmediateDecay(state, payload){
            state.immediateDecay = payload
        },
        setDelayedDecay(state, payload){
            state.delayedDecay = payload
        },
        setCurrentHW(state, payload){
            state.currentHW = payload
        },
        setHotHW(state, payload){
            state.hotHW = payload
        },
        setBPSBricked(state, payload){
            state.bpsBricked = payload
        },
        setDecrypted(state, payload){
            state.decrypted = payload
        },
        setNumberToRecover(state, payload){
            state.numberToRecover = payload
            if(payload === 5){
                state.privacyKeysFound = false
            }
        },    
        setTripwireSetup(state, payload){
            state.tripwireSetup = payload
            if(payload === false){
                state.tripwireTripped = 'none'
            }
        },
        setRecoverySetup(state, payload){
            state.recoverySetup = payload
        },
        setDuressSetup(state, payload){
            state.duressSetup = payload
        },
        setSetupCD(state, payload){
            state.setupCD = payload
        },
        setSetupStep(state, payload){
            state.setupStep = payload
        },
        setSetupStage(state, payload){
            state.setupStage = payload
        },
        setSysPass(state, payload){
            state.sysPass = payload
        },
        setDeviceList(state, payload){
            state.deviceList = payload
        },
        setNode(state, payload){
            state.node = payload
        }
    },
    actions:{//asynchronous, used for external API calls (dispatch)
    },
    modules:{},
    getters:{ //get data from state, allows for changing/filtering
        getDebug(state){
            return state.debug
        },
        getShowDebug(state){
            return state.showDebug
        },
        getLoadMessage(state){
            return state.loadMessage
        },
        getErrorMessage(state){
            return state.errorMessage
        },
        getHotTransactions(state){
            return state.hotTransactions
        },
        getImmediateTransactions(state){
            return state.immediateTransactions
        },
        getDelayedTransactions(state){
            return state.delayedTransactions
        },
        getHotBalance(state){
            return state.hotBalance
        },
        getImmediateBalance(state){
            return state.immediateBalance
        },
        getquickBalance(state){
            return state.quickBalance
        },
        getDelayedBalance(state){
            return state.delayedBalance
        },
        getBTCCoreHealthy(state){
            return state.btcCoreHealthy
        },
        getBPSHealthy(state){
            return state.bpsHealthy
        },
        getTripwireTripped(state){
            return state.tripwireTripped
        },
        getTimeMachineKeysFound(state){
            return state.timeMachineKeysFound
        },
        getPrivacyKeysFound(state){
            return state.privacyKeysFound
        },
        getTimeLock(state){
            return state.timeLock
        },
        getImmediateDecay(state){
            return state.immediateDecay
        },
        getDelayedDecay(state){
            return state.delayedDecay
        },
        getCurrentHW(state){
           return state.currentHW
        },
        getHotHW(state){
            return state.hotHW
         },
        getBPSBricked(state){
            return state.bpsBricked
        },
        getDecrypted(state){
            return state.decrypted
        },
        getNumberToRecover(state){
            return state.numberToRecover
        },
        getTripwireSetup(state){
            return state.tripwireSetup
        },
        getRecoverySetup(state){
            return state.recoverySetup
        },
        getDuressSetup(state){
            return state.duressSetup
        },
        getSetupCD(state){
            return state.setupCD
        },
        getSetupStep(state){
            return state.setupStep
        },
        getSetupStage(state){
            return state.setupStage
        },
        getSysPass(state){
            return state.sysPass
        },
        getDeviceList(state){
            return state.deviceList
        },
        getNode(state){
            return state.node
        }

    }
})

