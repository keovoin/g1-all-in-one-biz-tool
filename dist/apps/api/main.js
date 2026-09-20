/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"@gauzy/api","version":"0.1.0","description":"Gauzy API","license":"AGPL-3.0","homepage":"https://gauzy.co","repository":{"type":"git","url":"https://github.com/ever-co/ever-gauzy.git"},"bugs":{"url":"https://github.com/ever-co/ever-gauzy/issues"},"private":true,"author":{"name":"Ever Co. LTD","email":"ever@ever.co","url":"https://ever.co"},"scripts":{"typeorm":"yarn ts-node -r tsconfig-paths/register --project apps/api/tsconfig.app.json node_modules/.bin/typeorm","typeorm:sync":"yarn typeorm schema:sync","typeorm:seeds":"yarn typeorm migration:run","typeorm:flush":"yarn typeorm migration:revert","typeorm:create":"yarn typeorm migration:create","typeorm:preserve":"yarn typeorm:sync -- -f=ormconfig && yarn typeorm:seeds -- -f=ormconfig","migration:run":"yarn ts-node -r tsconfig-paths/register src/migration.ts migration:run","migration:revert":"yarn ts-node -r tsconfig-paths/register src/migration.ts migration:revert","migration:generate":"yarn ts-node -r tsconfig-paths/register src/migration.ts migration:generate","start":"yarn nx serve api","start:debug":"nodemon --config nodemon-debug.json","start:prod":"yarn nx serve api --configuration=production","build":"yarn nx build api --configuration=development","build:prod":"yarn nx build api --configuration=production","seed":"cross-env NODE_ENV=development NODE_OPTIONS=--max-old-space-size=14000 yarn ts-node -r tsconfig-paths/register --project apps/api/tsconfig.app.json src/seed.ts","seed:build":"yarn ng run api:seed","seed:all":"cross-env NODE_ENV=development NODE_OPTIONS=--max-old-space-size=14000 yarn ts-node -r tsconfig-paths/register --project apps/api/tsconfig.app.json src/seed-all.ts","seed:module":"cross-env NODE_ENV=development NODE_OPTIONS=--max-old-space-size=14000 yarn ts-node -r tsconfig-paths/register --project apps/api/tsconfig.app.json src/seed-module.ts --name","seed:all:build":"yarn ng run api:seed-all","seed:prod":"cross-env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=14000 yarn ts-node -r tsconfig-paths/register --project apps/api/tsconfig.app.json src/seed.ts","seed:prod:build":"yarn ng run api:seed -c=production"},"dependencies":{"@gauzy/core":"^0.1.0","@gauzy/scheduler":"^0.1.0","@gauzy/plugin-changelog":"^0.1.0","@gauzy/plugin-docs":"^0.1.0","@gauzy/plugin-integration-activepieces":"^0.1.0","@gauzy/plugin-integration-ai":"^0.1.0","@gauzy/plugin-integration-ever-async":"^0.1.0","@gauzy/plugin-integration-github":"^0.1.0","@gauzy/plugin-integration-hubstaff":"^0.1.0","@gauzy/plugin-integration-make-com":"^0.1.0","@gauzy/plugin-integration-zapier":"^0.1.0","@gauzy/plugin-integration-jira":"^0.1.0","@gauzy/plugin-integration-sim":"^0.1.0","@gauzy/plugin-integration-upwork":"^0.1.0","@gauzy/plugin-jitsu-analytics":"^0.1.0","@gauzy/plugin-job-proposal":"^0.1.0","@gauzy/plugin-job-search":"^0.1.0","@gauzy/plugin-knowledge-base":"^0.1.0","@gauzy/plugin-product-reviews":"^0.1.0","@gauzy/plugin-sentry":"^0.1.0","@gauzy/plugin-posthog":"^0.1.0","@gauzy/plugin-videos":"^0.1.0","@gauzy/plugin-camshot":"^0.1.0","@gauzy/plugin-soundshot":"^0.1.0","@gauzy/plugin-registry":"^0.1.0","dotenv":"^17.2.4","yargs":"^17.5.0"},"devDependencies":{"@nestjs/cli":"^11.0.23","@nestjs/schematics":"^11.1.0","@nestjs/testing":"^11.1.26","cross-env":"^10.1.0","nodemon":"^3.1.0","ts-node":"^10.9.2","typescript":"^5.9.3"}}');

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {

;// external "chalk"
const external_chalk_namespaceObject = require("chalk");
;// external "fs"
const external_fs_namespaceObject = require("fs");
;// external "path"
const external_path_namespaceObject = require("path");
;// external "dotenv"
const external_dotenv_namespaceObject = require("dotenv");
;// ./src/load-env.ts



/**
 * Load environment variables from a specified file.
 *
 * @param {string} envPath - The absolute path to the .env file.
 * @param {object} options - Options for dotenv configuration.
 * @param {boolean} [options.override=false] - Whether to override existing environment variables.
 */ function loadEnvFile(envPath, options = {}) {
    if (external_fs_namespaceObject.existsSync(envPath)) {
        console.time(`✔ Load ${external_path_namespaceObject.basename(envPath)} Time`);
        console.log(`Loading environment variables from: ${envPath}${options.override ? ' (override)' : ''}`);
        external_dotenv_namespaceObject.config({
            path: envPath,
            quiet: true,
            ...options
        });
        console.timeEnd(`✔ Load ${external_path_namespaceObject.basename(envPath)} Time`);
    }
}
/**
 * Load environment variables from .env and .env.local files.
 */ function loadEnv() {
    const currentDir = process.cwd();
    console.log('Current API Directory:', currentDir);
    // Define paths for environment files
    const envPaths = {
        env: external_path_namespaceObject.resolve(currentDir, '.env'),
        envLocal: external_path_namespaceObject.resolve(currentDir, '.env.local')
    };
    console.log(`API Environment Paths: .env -> ${envPaths.env}, .env.local -> ${envPaths.envLocal}`);
    // Load .env file as defaults (does not override existing variables)
    loadEnvFile(envPaths.env);
    // Load .env.local file with override (takes highest priority)
    loadEnvFile(envPaths.envLocal, {
        override: true
    });
}

;// external "@gauzy/core"
const core_namespaceObject = require("@gauzy/core");
;// external "node:path"
const external_node_path_namespaceObject = require("node:path");
;// external "@gauzy/constants"
const constants_namespaceObject = require("@gauzy/constants");
;// external "@gauzy/config"
const config_namespaceObject = require("@gauzy/config");
;// external "@gauzy/plugin-sentry"
const plugin_sentry_namespaceObject = require("@gauzy/plugin-sentry");
;// external "@gauzy/plugin-posthog"
const plugin_posthog_namespaceObject = require("@gauzy/plugin-posthog");
;// ./src/posthog.ts


/**
 * Initializes and configures the PostHog plugin for analytics and performance tracking.
 *
 * This function checks if PostHog tracking is enabled in the environment configuration.
 * If enabled, it initializes the PostHog plugin with the specified settings.
 * Otherwise, it logs a message indicating that PostHog was not initialized.
 *
 * @returns {typeof PosthogPlugin | null} The configured PostHog instance, or null if not initialized.
 */ function initializePosthog() {
    if (!config_namespaceObject.environment.posthog?.posthogEnabled || !config_namespaceObject.environment.posthog?.posthogKey) {
        console.log('PostHog not initialized: Tracking is disabled or API key is missing');
        return null;
    }
    // Configure PostHog
    return plugin_posthog_namespaceObject.PosthogPlugin.init({
        apiKey: config_namespaceObject.environment.posthog.posthogKey,
        apiHost: config_namespaceObject.environment.posthog.posthogHost || 'https://app.posthog.com',
        enableErrorTracking: true,
        flushInterval: config_namespaceObject.environment.posthog.posthogFlushInterval || 10000,
        flushAt: 20,
        autocapture: true,
        mock: false
    });
}
const PosthogAnalytics = initializePosthog();

;// ./version.ts
/**
 * @description
 * Current version of the Gauzy API.
 *
 * @example
 * ```
 * import { version } from './version';
 *
 * console.log('Sastra API version:', version);
 * ```
 *
 * @since 0.1.0
 */ const version = (__webpack_require__(1).version);

;// ./src/sentry.ts



/**
 * Initializes and configures the Sentry module for error tracking and performance monitoring.
 *
 * This function checks if a valid DSN is provided in the environment configuration.
 * If the DSN is available, it initializes Sentry with the specified settings.
 * Otherwise, it logs a message indicating that Sentry was not initialized.
 *
 * @returns {typeof SentryPlugin | null} The configured Sentry instance, or null if not initialized.
 */ function initializeSentry() {
    if (!config_namespaceObject.environment.sentry.dsn) {
        console.log('Sentry not initialized: DSN not provided');
        return null;
    }
    console.log('Initializing Sentry with DSN:', config_namespaceObject.environment.sentry.dsn);
    // Configure Sentry
    return plugin_sentry_namespaceObject.SentryPlugin.init({
        dsn: config_namespaceObject.environment.sentry.dsn,
        debug: process.env.SENTRY_DEBUG === 'true' || !config_namespaceObject.environment.production,
        environment: config_namespaceObject.environment.production ? 'production' : 'development',
        release: `gauzy@${version}`,
        logLevels: [
            'error'
        ],
        integrations: [
            ...plugin_sentry_namespaceObject.DefaultSentryIntegrations
        ],
        tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.01'),
        profilesSampleRate: parseFloat(process.env.SENTRY_PROFILE_SAMPLE_RATE || '1'),
        close: {
            enabled: true,
            timeout: 3000 // Forcefully quit the application after 3 seconds if needed
        }
    });
}
const SentryTracing = initializeSentry();

;// external "@gauzy/plugin-ai-chat"
const plugin_ai_chat_namespaceObject = require("@gauzy/plugin-ai-chat");
;// external "@gauzy/plugin-ai-provider-anthropic"
const plugin_ai_provider_anthropic_namespaceObject = require("@gauzy/plugin-ai-provider-anthropic");
;// external "@gauzy/plugin-ai-provider-openai"
const plugin_ai_provider_openai_namespaceObject = require("@gauzy/plugin-ai-provider-openai");
;// external "@gauzy/plugin-ai-provider-openrouter"
const plugin_ai_provider_openrouter_namespaceObject = require("@gauzy/plugin-ai-provider-openrouter");
;// external "@gauzy/plugin-ai-provider-vercel-gateway"
const plugin_ai_provider_vercel_gateway_namespaceObject = require("@gauzy/plugin-ai-provider-vercel-gateway");
;// external "@gauzy/plugin-ai-provider-gauzy-ai"
const plugin_ai_provider_gauzy_ai_namespaceObject = require("@gauzy/plugin-ai-provider-gauzy-ai");
;// external "@gauzy/plugin-ai-provider-gemini"
const plugin_ai_provider_gemini_namespaceObject = require("@gauzy/plugin-ai-provider-gemini");
;// external "@gauzy/plugin-ai-provider-grok"
const plugin_ai_provider_grok_namespaceObject = require("@gauzy/plugin-ai-provider-grok");
;// external "@gauzy/plugin-ai-provider-groq"
const plugin_ai_provider_groq_namespaceObject = require("@gauzy/plugin-ai-provider-groq");
;// external "@gauzy/plugin-ai-provider-mistral"
const plugin_ai_provider_mistral_namespaceObject = require("@gauzy/plugin-ai-provider-mistral");
;// external "@gauzy/plugin-ai-provider-deepgram"
const plugin_ai_provider_deepgram_namespaceObject = require("@gauzy/plugin-ai-provider-deepgram");
;// external "@gauzy/plugin-ai-provider-elevenlabs"
const plugin_ai_provider_elevenlabs_namespaceObject = require("@gauzy/plugin-ai-provider-elevenlabs");
;// external "@gauzy/plugin-ai-provider-speaches"
const plugin_ai_provider_speaches_namespaceObject = require("@gauzy/plugin-ai-provider-speaches");
;// external "@gauzy/plugin-ai-provider-localai"
const plugin_ai_provider_localai_namespaceObject = require("@gauzy/plugin-ai-provider-localai");
;// external "@gauzy/plugin-ai-provider-whisper-cpp"
const plugin_ai_provider_whisper_cpp_namespaceObject = require("@gauzy/plugin-ai-provider-whisper-cpp");
;// external "@gauzy/plugin-ai-provider-openai-compatible"
const plugin_ai_provider_openai_compatible_namespaceObject = require("@gauzy/plugin-ai-provider-openai-compatible");
;// external "@gauzy/plugin-changelog"
const plugin_changelog_namespaceObject = require("@gauzy/plugin-changelog");
;// external "@gauzy/plugin-docs"
const plugin_docs_namespaceObject = require("@gauzy/plugin-docs");
;// external "@gauzy/plugin-integration-ai"
const plugin_integration_ai_namespaceObject = require("@gauzy/plugin-integration-ai");
;// external "@gauzy/plugin-integration-github"
const plugin_integration_github_namespaceObject = require("@gauzy/plugin-integration-github");
;// external "@gauzy/plugin-integration-jira"
const plugin_integration_jira_namespaceObject = require("@gauzy/plugin-integration-jira");
;// external "@gauzy/plugin-integration-hubstaff"
const plugin_integration_hubstaff_namespaceObject = require("@gauzy/plugin-integration-hubstaff");
;// external "@gauzy/plugin-integration-make-com"
const plugin_integration_make_com_namespaceObject = require("@gauzy/plugin-integration-make-com");
;// external "@gauzy/plugin-integration-zapier"
const plugin_integration_zapier_namespaceObject = require("@gauzy/plugin-integration-zapier");
;// external "@gauzy/plugin-integration-activepieces"
const plugin_integration_activepieces_namespaceObject = require("@gauzy/plugin-integration-activepieces");
;// external "@gauzy/plugin-integration-sim"
const plugin_integration_sim_namespaceObject = require("@gauzy/plugin-integration-sim");
;// external "@gauzy/plugin-integration-plane"
const plugin_integration_plane_namespaceObject = require("@gauzy/plugin-integration-plane");
;// external "@gauzy/plugin-integration-ever-async"
const plugin_integration_ever_async_namespaceObject = require("@gauzy/plugin-integration-ever-async");
;// external "@gauzy/plugin-integration-upwork"
const plugin_integration_upwork_namespaceObject = require("@gauzy/plugin-integration-upwork");
;// external "@gauzy/plugin-jitsu-analytics"
const plugin_jitsu_analytics_namespaceObject = require("@gauzy/plugin-jitsu-analytics");
;// external "@gauzy/plugin-job-proposal"
const plugin_job_proposal_namespaceObject = require("@gauzy/plugin-job-proposal");
;// external "@gauzy/plugin-job-search"
const plugin_job_search_namespaceObject = require("@gauzy/plugin-job-search");
;// external "@gauzy/plugin-knowledge-base"
const plugin_knowledge_base_namespaceObject = require("@gauzy/plugin-knowledge-base");
;// external "@gauzy/plugin-product-reviews"
const plugin_product_reviews_namespaceObject = require("@gauzy/plugin-product-reviews");
;// external "@gauzy/plugin-videos"
const plugin_videos_namespaceObject = require("@gauzy/plugin-videos");
;// external "@gauzy/plugin-registry"
const plugin_registry_namespaceObject = require("@gauzy/plugin-registry");
;// external "@gauzy/plugin-camshot"
const plugin_camshot_namespaceObject = require("@gauzy/plugin-camshot");
;// external "@gauzy/plugin-soundshot"
const plugin_soundshot_namespaceObject = require("@gauzy/plugin-soundshot");
;// ./src/plugins.ts









































const { jitsu, sentry, posthog } = config_namespaceObject.environment;
/**
 * An array of plugins to be included or used in the codebase.
 */ const plugins = [
    // Includes the SentryPlugin based on the presence of Sentry configuration.
    ...sentry?.dsn ? [
        SentryTracing
    ] : [],
    // Includes the PostHogPlugin based on the presence of PostHog configuration.
    ...posthog?.posthogEnabled && posthog?.posthogKey ? [
        PosthogAnalytics
    ] : [],
    // Initializes the Jitsu Analytics Plugin by providing a configuration object.
    plugin_jitsu_analytics_namespaceObject.JitsuAnalyticsPlugin.init({
        config: {
            host: jitsu.serverHost,
            writeKey: jitsu.serverWriteKey,
            debug: jitsu.debug,
            echoEvents: jitsu.echoEvents
        }
    }),
    // AI agent chat engine (streaming endpoint, tools, BYOK credentials).
    plugin_ai_chat_namespaceObject.AiChatPlugin,
    // AI providers for the chat engine — one plugin per provider.
    plugin_ai_provider_anthropic_namespaceObject.AiProviderAnthropicPlugin,
    plugin_ai_provider_openai_namespaceObject.AiProviderOpenAiPlugin,
    plugin_ai_provider_openrouter_namespaceObject.AiProviderOpenRouterPlugin,
    plugin_ai_provider_vercel_gateway_namespaceObject.AiProviderVercelGatewayPlugin,
    // Sastra AI provider is registered but chat is not routed through it yet (see plugin README).
    plugin_ai_provider_gauzy_ai_namespaceObject.AiProviderGauzyAiPlugin,
    plugin_ai_provider_gemini_namespaceObject.AiProviderGeminiPlugin,
    plugin_ai_provider_grok_namespaceObject.AiProviderGrokPlugin,
    // OpenAI-compatible cloud providers with chat + speech-to-text (dictation).
    plugin_ai_provider_groq_namespaceObject.AiProviderGroqPlugin,
    plugin_ai_provider_mistral_namespaceObject.AiProviderMistralPlugin,
    // LOCAL / self-hosted providers (no API key needed): Speaches + whisper.cpp are voice-only,
    // LocalAI and the generic OpenAI-compatible endpoint do chat + voice.
    plugin_ai_provider_speaches_namespaceObject.AiProviderSpeachesPlugin,
    plugin_ai_provider_localai_namespaceObject.AiProviderLocalAiPlugin,
    plugin_ai_provider_whisper_cpp_namespaceObject.AiProviderWhisperCppPlugin,
    plugin_ai_provider_openai_compatible_namespaceObject.AiProviderOpenAiCompatiblePlugin,
    // Cloud speech-to-text only providers (voice / dictation).
    plugin_ai_provider_deepgram_namespaceObject.AiProviderDeepgramPlugin,
    plugin_ai_provider_elevenlabs_namespaceObject.AiProviderElevenLabsPlugin,
    // Documents hub plugin — registered after the AI chat/provider plugins so the provider registry is populated first.
    plugin_docs_namespaceObject.DocsPlugin,
    // Indicates the inclusion or intention to use the ChangelogPlugin in the codebase.
    plugin_changelog_namespaceObject.ChangelogPlugin,
    // Indicates the inclusion or intention to use the IntegrationActivepiecesPlugin in the codebase.
    plugin_integration_activepieces_namespaceObject.IntegrationActivepiecesPlugin,
    // Indicates the inclusion or intention to use the IntegrationAIPlugin in the codebase.
    plugin_integration_ai_namespaceObject.IntegrationAIPlugin,
    // Indicates the inclusion or intention to use the IntegrationGithubPlugin in the codebase.
    plugin_integration_github_namespaceObject.IntegrationGithubPlugin,
    // Indicates the inclusion or intention to use the IntegrationHubstaffPlugin in the codebase.
    plugin_integration_hubstaff_namespaceObject.IntegrationHubstaffPlugin,
    // Indicates the inclusion or intention to use the IntegrationMakeComPlugin in the codebase.
    plugin_integration_make_com_namespaceObject.IntegrationMakeComPlugin,
    // Indicates the inclusion or intention to use the IntegrationJiraPlugin in the codebase.
    plugin_integration_jira_namespaceObject.IntegrationJiraPlugin,
    // Indicates the inclusion or intention to use the IntegrationUpworkPlugin in the codebase.
    plugin_integration_upwork_namespaceObject.IntegrationUpworkPlugin,
    // Indicates the inclusion or intention to use the IntegrationPlanePlugin in the codebase.
    plugin_integration_plane_namespaceObject.IntegrationPlanePlugin,
    plugin_integration_ever_async_namespaceObject.IntegrationEverAsyncPlugin,
    // Indicates the inclusion or intention to use the IntegrationSimPlugin in the codebase.
    plugin_integration_sim_namespaceObject.IntegrationSimPlugin,
    // Indicates the inclusion or intention to use the IntegrationZapierPlugin in the codebase.
    plugin_integration_zapier_namespaceObject.IntegrationZapierPlugin,
    // Indicates the inclusion or intention to use the JobProposalPlugin in the codebase.
    plugin_job_proposal_namespaceObject.JobProposalPlugin,
    // Indicates the inclusion or intention to use the JobSearchPlugin in the codebase.
    plugin_job_search_namespaceObject.JobSearchPlugin,
    // Indicates the inclusion or intention to use the KnowledgeBasePlugin in the codebase.
    plugin_knowledge_base_namespaceObject.KnowledgeBasePlugin,
    // Indicates the inclusion or intention to use the ProductReviewsPlugin in the codebase.
    plugin_product_reviews_namespaceObject.ProductReviewsPlugin,
    // Indicates the inclusion or intention to use the VideosPlugin in the codebase.
    plugin_videos_namespaceObject.VideosPlugin,
    // Indicates the inclusion or intention to use the CamshotPlugin in the codebase.
    plugin_camshot_namespaceObject.CamshotPlugin,
    // Indicates the inclusion or intention to use the SoundshotPlugin in the codebase.
    plugin_soundshot_namespaceObject.SoundshotPlugin,
    // Indicates the inclusion or intention to use the RegistryPlugin in the codebase.
    plugin_registry_namespaceObject.RegistryPlugin
];

;// ./src/plugin.config.ts










const { sentry: plugin_config_sentry, posthog: plugin_config_posthog } = config_namespaceObject.environment;
console.log(external_chalk_namespaceObject.magenta(`API Version %s`), version);
console.log('Plugin Config -> __dirname: ' + __dirname);
console.log('Plugin Config -> process.cwd: ' + process.cwd());
// TODO: maybe better to use process.cwd() instead of __dirname?
let assetPath;
let assetPublicPath;
// For Docker environment
if (__dirname.startsWith('/srv/gauzy')) {
    assetPath = '/srv/gauzy/apps/api/src/assets';
    assetPublicPath = '/srv/gauzy/apps/api/public';
} else {
    // Determine if running in production (dist) or development (src)
    const isDist = __dirname.includes(external_node_path_namespaceObject.join('dist'));
    console.log('Plugin Config -> isDist: ' + isDist);
    // Adjust the base path based on the environment
    const basePath = isDist ? external_node_path_namespaceObject.resolve(process.cwd(), 'dist/apps/api') // For production
     : external_node_path_namespaceObject.resolve(process.cwd(), 'apps/api'); // For development
    console.log('Plugin Config -> basePath: ' + basePath);
    // Set the asset paths relative to basePath
    assetPath = isDist ? external_node_path_namespaceObject.join(basePath, 'assets') // In dist, assets are directly under 'assets'
     : external_node_path_namespaceObject.join(basePath, 'src', 'assets'); // In dev, assets are under 'src/assets'
    // Default public directory for assets
    assetPublicPath = isDist ? external_node_path_namespaceObject.resolve(process.cwd(), 'apps/api/public') // Adjusted for dist structure
     : external_node_path_namespaceObject.resolve(__dirname, '../../../apps/api/public');
}
console.log('Plugin Config -> assetPath: ' + assetPath);
console.log('Plugin Config -> assetPublicPath: ' + assetPublicPath);
console.log('DB Synchronize: ' + process.env.DB_SYNCHRONIZE);
/**
 * Application plugin configuration for production environment.
 */ const pluginConfig = {
    apiConfigOptions: {
        host: process.env.API_HOST || constants_namespaceObject.DEFAULT_API_HOST,
        port: process.env.API_PORT || constants_namespaceObject.DEFAULT_API_PORT,
        baseUrl: process.env.API_BASE_URL || constants_namespaceObject.DEFAULT_API_BASE_URL,
        middleware: [],
        graphqlConfigOptions: {
            path: constants_namespaceObject.DEFAULT_GRAPHQL_API_PATH,
            playground: true,
            debug: true,
            apolloServerPlugins: []
        }
    },
    dbConnectionOptions: {
        retryAttempts: 100,
        retryDelay: 3000,
        migrationsTransactionMode: 'each',
        migrationsRun: process.env.DB_SYNCHRONIZE === 'true' ? false : true,
        ...config_namespaceObject.dbTypeOrmConnectionConfig
    },
    dbMikroOrmConnectionOptions: {
        ...config_namespaceObject.dbMikroOrmConnectionConfig
    },
    dbKnexConnectionOptions: {
        retryAttempts: 100,
        retryDelay: 3000,
        ...config_namespaceObject.dbKnexConnectionConfig
    },
    assetOptions: {
        assetPath: assetPath,
        assetPublicPath: assetPublicPath
    },
    logger: (()=>{
        const loggers = [];
        if (plugin_config_sentry?.dsn) {
            loggers.push(new plugin_sentry_namespaceObject.SentryService(SentryTracing.options));
        }
        if (plugin_config_posthog?.posthogEnabled && plugin_config_posthog?.posthogKey) {
            loggers.push(new plugin_posthog_namespaceObject.PosthogService(PosthogAnalytics.options));
        }
        // Combine both, or return undefined if no logger is configured
        if (loggers.length === 0) {
            return undefined;
        } else if (loggers.length === 1) {
            return loggers[0];
        } else {
            return {
                log: (...args)=>loggers.forEach((logger)=>logger.log?.(...args)),
                error: (...args)=>loggers.forEach((logger)=>logger.error?.(...args)),
                warn: (...args)=>loggers.forEach((logger)=>logger.warn?.(...args)),
                debug: (...args)=>loggers.forEach((logger)=>logger.debug?.(...args)),
                verbose: (...args)=>loggers.forEach((logger)=>logger.verbose?.(...args))
            };
        }
    })(),
    plugins: plugins
};

;// ./src/main.ts


// Load environment variables
console.log('Loading Environment Variables...');
loadEnv();
console.log('Environment Variables Loaded');
// Start measuring the overall API startup time
console.time(external_chalk_namespaceObject.green(`✔ Total API Startup Time`));
console.log(external_chalk_namespaceObject.green(`✔ API Starting...`));
console.time(external_chalk_namespaceObject.green(`✔ API Running`));
console.log('Bootstrap Loading...');
console.time('Bootstrap Time');

console.timeEnd('Bootstrap Time');
console.log('Bootstrap Loaded');
console.log('Plugin Config Loading...');
console.time('Plugin Config Time');

console.timeEnd('Plugin Config Time');
console.log('Plugin Config Loaded');
(0,core_namespaceObject.bootstrap)(pluginConfig).then(()=>{
    console.timeEnd(external_chalk_namespaceObject.green(`✔ API Running`));
    console.timeEnd(external_chalk_namespaceObject.green(`✔ Total API Startup Time`));
}).catch(async (error)=>{
    console.log(error);
    console.timeEnd(external_chalk_namespaceObject.green(`✔ Total API Startup Time`));
    process.exit(1);
});

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map