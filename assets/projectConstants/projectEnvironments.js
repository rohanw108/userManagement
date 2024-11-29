const projectEnvironmentTypes = {
    localEnv: 'LOCAL',
    developmentEnv: 'DEVELOPMENT',
    testEnv: 'TEST',
    productionEnv: 'PRODUCTION'
};

// freez the object
    Object.freeze(projectEnvironmentTypes);

// export section 
    export default projectEnvironmentTypes;