# Jumbo WebCrawler - Technical Specification

## 1. System Overview

The Jumbo WebCrawler is an advanced web-based crawler application designed to provide users with powerful website crawling, content extraction, link validation, and data export capabilities. This application serves both single-site deep crawling and bulk URL validation needs through an intuitive, modern dashboard interface.

## 2. Architecture

### 2.1 System Architecture

The application follows a modern client-server architecture with clear separation of concerns:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│     Backend     │────▶│    Databases    │
│  (React + TS)   │     │  (Node.js + TS) │     │ (PostgreSQL,    │
│                 │◀────│                 │◀────│    Redis)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │  ▲
                               │  │
                               ▼  │
                        ┌─────────────────┐
                        │                 │
                        │ External Sites  │
                        │                 │
                        └─────────────────┘
```

### 2.2 Technology Stack

#### Frontend Technologies
- **Core Framework**: React 18+ with TypeScript for type safety
- **UI Components**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for global state with React Context for local state
- **File Handling**: React Dropzone for drag-and-drop file uploads
- **Data Visualization**: Recharts for statistical visualization and reporting
- **Build System**: Vite for fast development and optimized production builds

#### Backend Technologies
- **Runtime Environment**: Node.js 18+ with TypeScript
- **API Framework**: Express.js with structured router organization
- **Web Crawling Engine**: Crawlee (Puppeteer-based) for JavaScript rendering support
- **Content Processing**:
  - Turndown for HTML to Markdown conversion
  - Mozilla Readability for clean content extraction
- **File Processing**: Papa Parse for CSV handling, XLSX for Excel files
- **Job Management**: Bull Queue with Redis for background task processing
- **Rate Limiting**: Custom implementation respecting robots.txt directives

#### Data Storage
- **Primary Database**: PostgreSQL for relational data (crawl history, metadata)
- **Caching Layer**: Redis for URL status caching and temporary data storage
- **File Storage**: Local file system (development) and AWS S3/MinIO (production)
- **Export Format Support**: JSON, Markdown (.md), MDX (.mdx)

#### Infrastructure
- **Development Environment**: Docker Compose for local development
- **Deployment**: Docker containers for consistent environments
- **API Documentation**: Swagger/OpenAPI for interactive API documentation
- **Logging**: Winston with structured JSON logging
- **Monitoring**: Health check endpoints and custom crawl metrics

## 3. Component Specifications

### 3.1 Frontend Components

#### 3.1.1 Main Dashboard
- **URL Input Component**:
  - Input validation with URL format checking
  - History dropdown of recent crawls
  - Quick-start buttons for common configurations
  
- **Configuration Panel Component**:
  - Expandable/collapsible settings section
  - Range sliders for numeric parameters
  - Toggles for boolean options
  - Tooltips explaining each option
  
- **Progress Display Component**:
  - Circular progress indicator
  - Real-time counters for pages crawled/failed
  - Animated queue size visualization
  
- **Control Panel Component**:
  - Accessible button controls (Pause/Resume/Stop)
  - Keyboard shortcuts for common actions
  - Confirmation dialogs for destructive actions

#### 3.1.2 Bulk URL Validation Interface
- **File Upload Component**:
  - Drag-and-drop zone with visual feedback
  - Format validation with error messaging
  - Progress indicator during upload
  
- **URL Preview Component**:
  - Virtualized list for performance
  - Syntax highlighting for URLs
  - Pagination for large lists
  
- **Validation Settings Component**:
  - Method selector (HEAD/GET)
  - Timeout configuration
  - Redirect policy options
  - Custom header editor
  
- **Results Display Component**:
  - Color-coded status indicators
  - Sortable/filterable results table
  - Export options for processed data

#### 3.1.3 Results Management
- **Export Format Selector**:
  - Visual format selection cards
  - Format-specific configuration options
  - Preview generation
  
- **File Naming Component**:
  - Template-based naming with variables
  - Timestamp format options
  - Path selection
  
- **Batch Management Component**:
  - Multi-select functionality
  - Batch action buttons
  - Progress tracking for batch operations
  
- **Content Preview Component**:
  - Syntax-highlighted previews
  - Responsive layout
  - Collapsible sections

#### 3.1.4 Crawl Summary Dashboard
- **Statistics Overview Component**:
  - Key metrics with comparison to averages
  - Card-based layout for key statistics
  
- **Chart Components**:
  - Response code distribution (pie chart)
  - Crawl speed over time (line chart)
  - Content type breakdown (bar chart)
  - Link depth distribution (tree visualization)
  
- **Error Analysis Component**:
  - Categorized error listing
  - Expandable error details
  - Suggested remediation actions

### 3.2 Backend Services

#### 3.2.1 Crawler Service
- **Request Handling**:
  - Custom user-agent management
  - Cookie handling capabilities
  - Header customization
  - Proxy support (optional)
  
- **Crawl Algorithms**:
  - Breadth-first crawling with depth control
  - Priority-based crawling for important paths
  - Parallel request management with concurrency limits
  
- **Content Processing Pipeline**:
  - HTML parsing and cleaning
  - Markdown conversion with formatting preservation
  - Metadata extraction from various page elements
  - Link extraction and normalization
  
- **Rate Limiting**:
  - robots.txt parser and enforcer
  - Adaptive delay based on server response
  - Domain-specific rate limiting
  - Concurrent connection limiting

#### 3.2.2 URL Validation Service
- **Batch Processing**:
  - Chunked processing for large files
  - Parallel validation with configurable concurrency
  - Progress tracking and reporting
  
- **Validation Methods**:
  - HEAD request validation (fast)
  - GET request validation (thorough)
  - Custom request validation (configurable)
  
- **Result Enhancement**:
  - Response time measurement
  - Redirect chain tracking
  - Content type detection
  - Response header analysis

#### 3.2.3 Export Service
- **Format Converters**:
  - JSON formatter with pretty-print option
  - Markdown generator with customizable templates
  - MDX generator with component mapping
  
- **File Management**:
  - Temporary file cleanup
  - Compression for large exports
  - Streaming download support
  
- **Batch Export**:
  - Job queuing for large exports
  - Email notification when complete (optional)
  - Resumable exports for very large datasets

#### 3.2.4 Job Management Service
- **Queue Management**:
  - Priority-based job scheduling
  - Job persistence across restarts
  - Stalled job detection and recovery
  
- **Resource Control**:
  - CPU usage monitoring and throttling
  - Memory consumption tracking
  - Disk space management for exports
  
- **Reporting**:
  - Job status notifications
  - Detailed job logs
  - Performance metrics collection

### 3.3 Data Models

#### 3.3.1 Crawl Job
```typescript
interface CrawlJob {
  id: string;                // UUID for the job
  url: string;               // Target URL
  status: JobStatus;         // enum: queued, running, completed, failed, stopped
  config: CrawlConfig;       // Configuration settings
  startedAt: Date;           // Timestamp when job started
  completedAt?: Date;        // Timestamp when job finished
  stats: CrawlStats;         // Crawl statistics
  userId?: string;           // Optional user identifier
  createdAt: Date;           // Creation timestamp
  updatedAt: Date;           // Last update timestamp
}

interface CrawlConfig {
  maxPages: number;          // Max pages to crawl
  maxDepth: number;          // Max link depth
  respectRobotsTxt: boolean; // Whether to respect robots.txt
  crawlDelay: number;        // Delay between requests (ms)
  includeExternalLinks: boolean; // Whether to follow external links
  contentTypeFilters: string[]; // Content types to include
}

interface CrawlStats {
  pagesCrawled: number;      // Number of pages successfully crawled
  pagesFailed: number;       // Number of pages that failed
  queueSize: number;         // Current queue size
  averageResponseTime: number; // Average response time (ms)
  startTime: Date;           // When crawl started
  endTime?: Date;            // When crawl ended
  downloadSize: number;      // Total bytes downloaded
}
```

#### 3.3.2 Page Data
```typescript
interface PageData {
  id: string;                // UUID for the page
  jobId: string;             // Reference to crawl job
  url: string;               // Page URL
  normalizedUrl: string;     // Normalized URL for deduplication
  parentUrl?: string;        // URL of the parent page
  depth: number;             // Depth from starting URL
  statusCode: number;        // HTTP status code
  title: string;             // Page title
  description?: string;      // Meta description
  contentType: string;       // Content MIME type
  htmlContent?: string;      // Original HTML (optional storage)
  markdownContent: string;   // Converted Markdown content
  links: LinkData[];         // Extracted links
  images: ImageData[];       // Extracted images
  metadata: Record<string, any>; // Additional metadata
  crawledAt: Date;           // When this page was crawled
  responseTimeMs: number;    // Response time in milliseconds
  redirectChain?: string[];  // Chain of redirects if any
}

interface LinkData {
  url: string;               // Link URL
  text: string;              // Link text
  isExternal: boolean;       // Whether it's an external link
  isProcessed: boolean;      // Whether it has been crawled
}

interface ImageData {
  url: string;               // Image URL
  alt: string;               // Alt text
  width?: number;            // Width if available
  height?: number;           // Height if available
}
```

#### 3.3.3 Validation Job
```typescript
interface ValidationJob {
  id: string;                // UUID for the job
  fileName: string;          // Original filename
  fileType: string;          // File type (CSV, XLSX, etc.)
  status: JobStatus;         // Job status
  config: ValidationConfig;  // Validation configuration
  stats: ValidationStats;    // Validation statistics
  outputFilePath: string;    // Path to result file
  createdAt: Date;           // Creation timestamp
  updatedAt: Date;           // Last update timestamp
}

interface ValidationConfig {
  method: 'HEAD' | 'GET';    // Request method
  timeout: number;           // Timeout in ms
  followRedirects: boolean;  // Whether to follow redirects
  concurrency: number;       // Number of concurrent requests
  customHeaders?: Record<string, string>; // Custom request headers
}

interface ValidationStats {
  totalUrls: number;         // Total URLs to validate
  processedUrls: number;     // URLs processed so far
  successUrls: number;       // Successfully validated URLs
  failedUrls: number;        // Failed URLs
  averageResponseTime: number; // Average response time
  startTime: Date;           // Start timestamp
  endTime?: Date;            // End timestamp
}
```

## 4. API Specifications

### 4.1 Crawl API

#### 4.1.1 Start Crawl
- **Endpoint**: `POST /api/crawl/start`
- **Description**: Initiates a new crawl job
- **Request Body**:
  ```typescript
  {
    url: string;             // Target URL to crawl
    settings: {              // Optional crawl settings
      maxPages?: number;     // Max pages (default: 50)
      maxDepth?: number;     // Max depth (default: 3)
      delay?: number;        // Delay in ms (default: 1000)
      respectRobots?: boolean; // Respect robots.txt (default: true)
      includeExternal?: boolean; // Include external links (default: false)
      contentTypes?: string[]; // Content types to include
    }
  }
  ```
- **Response**:
  ```typescript
  {
    jobId: string;           // UUID of the created job
    status: "started";       // Job status
    estimatedTime?: number;  // Estimated completion time in seconds
  }
  ```
- **Status Codes**:
  - 201: Crawl job created successfully
  - 400: Invalid URL or settings
  - 429: Too many concurrent jobs

#### 4.1.2 Get Crawl Status
- **Endpoint**: `GET /api/crawl/status/:jobId`
- **Description**: Gets the current status of a crawl job
- **URL Parameters**:
  - jobId: UUID of the crawl job
- **Response**:
  ```typescript
  {
    status: "queued" | "running" | "completed" | "failed" | "stopped";
    progress: number;        // Progress percentage (0-100)
    stats: {                 // Current statistics
      pagesCrawled: number;
      pagesFailed: number;
      queueSize: number;
      elapsedTime: number;   // Seconds elapsed
    };
    errors?: {               // Error information if any
      count: number;
      samples: Array<{
        url: string;
        statusCode?: number;
        message: string;
      }>;
    }
  }
  ```
- **Status Codes**:
  - 200: Status retrieved successfully
  - 404: Job not found

#### 4.1.3 Get Crawl Results
- **Endpoint**: `GET /api/crawl/results/:jobId`
- **Description**: Retrieves crawl results
- **URL Parameters**:
  - jobId: UUID of the crawl job
- **Query Parameters**:
  - format: "json" | "markdown" | "mdx" (default: "json")
  - download: boolean (default: false)
- **Response**:
  - If download=false: JSON response with results
  - If download=true: File download in requested format
- **Status Codes**:
  - 200: Results retrieved successfully
  - 202: Results being prepared, not ready yet
  - 404: Job not found

#### 4.1.4 Stop Crawl
- **Endpoint**: `POST /api/crawl/stop/:jobId`
- **Description**: Stops an ongoing crawl job
- **URL Parameters**:
  - jobId: UUID of the crawl job
- **Response**:
  ```typescript
  {
    status: "stopping" | "stopped";
    message: string;
  }
  ```
- **Status Codes**:
  - 200: Job stopped or stopping
  - 404: Job not found

### 4.2 Validation API

#### 4.2.1 Submit Bulk Validation
- **Endpoint**: `POST /api/validate/bulk`
- **Description**: Uploads file and starts validation
- **Request**: FormData with file upload
- **Response**:
  ```typescript
  {
    jobId: string;           // UUID of validation job
    fileInfo: {              // Information about the file
      name: string;
      type: string;
      size: number;
      urlCount: number;      // Estimated URL count
    };
    estimatedTime: number;   // Estimated time in seconds
  }
  ```
- **Status Codes**:
  - 201: Validation job created
  - 400: Invalid file or format
  - 413: File too large

#### 4.2.2 Get Validation Status
- **Endpoint**: `GET /api/validate/status/:jobId`
- **Description**: Gets validation job status
- **URL Parameters**:
  - jobId: UUID of the validation job
- **Response**:
  ```typescript
  {
    status: "queued" | "running" | "completed" | "failed";
    progress: number;        // Progress percentage (0-100)
    stats: {
      processed: number;     // URLs processed
      successful: number;    // URLs validated successfully
      failed: number;        // URLs that failed validation
      elapsedTime: number;   // Seconds elapsed
    }
  }
  ```
- **Status Codes**:
  - 200: Status retrieved successfully
  - 404: Job not found

#### 4.2.3 Download Validation Results
- **Endpoint**: `GET /api/validate/download/:jobId`
- **Description**: Downloads validation results
- **URL Parameters**:
  - jobId: UUID of the validation job
- **Query Parameters**:
  - format: "csv" | "xlsx" | "json" (default: same as input)
- **Response**: File download in requested format
- **Status Codes**:
  - 200: File download initiated
  - 404: Job not found or results expired

## 5. User Interface Specifications

### 5.1 Main Dashboard

The main dashboard provides a central interface for initiating crawls, monitoring progress, and accessing results.

**Layout**:
- Centered URL input field with validation
- Configuration panel (expandable/collapsible)
- Progress and status display area
- Control buttons (Start, Pause, Resume, Stop)
- Recent crawls list
- Quick access to results

**User Flow**:
1. User enters a URL in the input field
2. User adjusts crawl settings in configuration panel
3. User clicks "Start Crawl" button
4. Progress display shows real-time updates
5. User can pause, resume, or stop the crawl
6. On completion, results summary is displayed
7. User can access full results or start a new crawl

### 5.2 Bulk Validation Interface

The bulk validation interface allows users to upload files containing URLs and validate them in batch.

**Layout**:
- File upload area with drag-and-drop support
- Validation settings panel
- Preview of detected URLs
- Progress display during validation
- Results table with status indicators
- Download options for validated data

**User Flow**:
1. User drags and drops file or clicks to browse
2. System parses file and displays URL preview
3. User configures validation settings
4. User clicks "Start Validation" button
5. Progress display shows real-time updates
6. On completion, results table is displayed
7. User can download enhanced file with validation results

### 5.3 Results Management

The results management interface provides access to crawl and validation results with export options.

**Layout**:
- Tabbed interface for different job types
- Filterable/sortable results list
- Result details panel
- Export format selection
- Preview capability
- Batch action buttons

**User Flow**:
1. User selects a completed job from the list
2. System displays summary of results
3. User can explore detailed results
4. User selects export format
5. Preview of export is displayed
6. User clicks "Download" button
7. File is generated and downloaded

### 5.4 Crawl Summary Dashboard

The crawl summary dashboard provides visualizations and analytics of crawl results.

**Layout**:
- Key metrics at the top
- Visual charts for different statistics
- Filterable error listing
- Link structure visualization
- Content type breakdown

**User Flow**:
1. User selects a completed crawl job
2. System generates visualizations and analytics
3. User can interact with charts and graphs
4. User can filter and explore specific aspects
5. User can export reports or specific visualizations

## 6. Security Considerations

### 6.1 Input Validation
- All user inputs are validated and sanitized
- URL validation prevents malicious URL injection
- File uploads are scanned for malware
- Rate limiting prevents abuse

### 6.2 Data Protection
- No sensitive data from crawled sites is stored
- Temporary files are securely deleted after processing
- Access controls for job results
- Secure handling of API keys and credentials

### 6.3 Infrastructure Security
- Regular dependency updates
- Security headers implementation
- HTTPS-only communication
- Containerization for isolation

## 7. Performance Considerations

### 7.1 Crawling Efficiency
- Intelligent crawl scheduling
- Respect for server resources
- Caching to prevent duplicate requests
- Graceful handling of slow sites

### 7.2 Resource Management
- Memory usage monitoring for large crawls
- Disk space management for exports
- CPU utilization balancing
- Connection pool management

### 7.3 Scalability
- Horizontal scaling capability
- Job distribution across workers
- Database sharding for large datasets
- Caching layer for frequently accessed data

## 8. Development and Deployment

### 8.1 Development Environment
- Docker Compose setup for local development
- Hot reloading for frontend
- Nodemon for backend development
- Shared environment configuration

### 8.2 Testing Strategy
- Unit tests for core functions
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Performance benchmarks

### 8.3 Deployment Process
- Docker containers for consistent environments
- Multi-stage builds for optimization
- Health checks and graceful shutdown
- Rollback capability

## 9. Monitoring and Maintenance

### 9.1 Logging
- Structured JSON logging
- Log levels for different environments
- Request/response logging (sanitized)
- Error tracking with stack traces

### 9.2 Metrics
- Crawl performance metrics
- API response times
- Resource utilization
- Error rates and patterns

### 9.3 Alerting
- Critical error notifications
- Resource threshold alerts
- Service availability monitoring
- Job completion notifications

## 10. Future Enhancements

### 10.1 Phase 1 Enhancements
- User authentication and saved crawls
- Custom extraction rules
- Advanced filtering options
- Scheduled crawls

### 10.2 Phase 2 Enhancements
- Diffing between crawl runs
- Content change detection
- Screenshot capture
- Sitemap generation

### 10.3 Phase 3 Enhancements
- Machine learning for content categorization
- Natural language processing for text analysis
- Visual site mapping
- API access for programmatic usage

## Appendix

### A. Glossary
- **Crawl**: The process of systematically browsing and indexing web pages
- **URL Validation**: Process of checking if URLs are valid and accessible
- **Rate Limiting**: Restricting the frequency of requests to a server
- **robots.txt**: A file that tells web crawlers which pages to avoid
- **Sitemap**: An XML file listing important pages on a website
- **Markdown**: A lightweight markup language for formatting text
- **MDX**: Markdown with JSX support for interactive components

### B. References
- Crawlee Documentation: [https://crawlee.dev/](https://crawlee.dev/)
- Mozilla Readability: [https://github.com/mozilla/readability](https://github.com/mozilla/readability)
- Turndown: [https://github.com/mixmark-io/turndown](https://github.com/mixmark-io/turndown)
- Bull Queue: [https://github.com/OptimalBits/bull](https://github.com/OptimalBits/bull)
- React 18 Documentation: [https://reactjs.org/](https://reactjs.org/)
- Tailwind CSS: [https://tailwindcss.com/](https://tailwindcss.com/)
- shadcn/ui: [https://ui.shadcn.com/](https://ui.shadcn.com/)
