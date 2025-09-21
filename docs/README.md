# Advanced Open Source Web Crawler Application - Development Specification

## Project Overview
Create a comprehensive web-based crawler application that allows users to crawl websites, extract content, validate link status, and export results in multiple formats. The application should handle both single-site crawling and bulk URL validation with a modern, intuitive dashboard interface.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand or React Context
- **File Handling**: React Dropzone for file uploads
- **Charts/Visualization**: Recharts for crawl statistics
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with TypeScript
- **Web Crawler**: Crawlee (Puppeteer-based) for JavaScript rendering
- **Content Processing**: 
  - Turndown (HTML to Markdown conversion)
  - Mozilla Readability (content extraction)
- **File Processing**: Papa Parse (CSV handling), XLSX (Excel files)
- **Queue System**: Bull Queue with Redis (for job management)
- **Rate Limiting**: Custom rate limiter respecting robots.txt

### Storage & Data
- **Database**: PostgreSQL (crawl history, metadata)
- **File Storage**: Local file system or AWS S3/MinIO
- **Cache**: Redis (URL status, temporary data)
- **Export Formats**: JSON, Markdown (.md), MDX (.mdx)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston with structured logging
- **Monitoring**: Basic health checks and crawl metrics

## Core Features & User Interface

### 1. Main Dashboard
**Primary Crawling Interface**:
- Clean, centered input field for website URL entry
- Crawl configuration panel:
  - Maximum pages to crawl (default: 50, max: 1000)
  - Maximum depth (default: 3, max: 10)
  - Respect robots.txt (toggle)
  - Crawl delay (500ms - 5000ms)
  - Include external links (toggle)
  - Content type filters (HTML only, include PDFs, etc.)
- Real-time crawl progress indicator
- Live statistics: pages crawled, failed, queue size
- Pause/Resume/Stop crawl controls

### 2. Bulk URL Validation Tool
**Upload & Validate Interface**:
- Drag-and-drop file upload area
- Supported formats: TXT, CSV, Excel (.xlsx, .xls), JSON
- Preview uploaded URLs (first 10-20 items)
- Validation settings:
  - Check method (HEAD request vs full GET)
  - Timeout settings (default: 10 seconds)
  - Follow redirects (toggle)
  - Custom headers (optional)
- Progress bar with real-time status updates
- Download updated file with status columns

### 3. Results Management
**Export & Download Center**:
- Export format selection: JSON, Markdown (.md), MDX (.mdx)
- File naming conventions with timestamps
- Batch download for multiple exports
- Preview content before download
- Search and filter crawled content

### 4. Crawl Summary Dashboard
**Analytics & Reporting**:
- Visual charts showing crawl statistics
- Success/failure rates with detailed breakdowns
- Response time analytics
- Content type distribution
- Link hierarchy visualization
- Error categorization (404, timeout, blocked, etc.)

## Detailed Feature Requirements

### Single Website Crawling
**Input**: Website URL (with validation)
**Process**:
1. Validate URL format and accessibility
2. Fetch robots.txt and sitemap.xml
3. Implement breadth-first crawling with configurable depth
4. Extract clean content using Mozilla Readability
5. Convert HTML to Markdown using Turndown
6. Generate structured JSON with metadata
7. Track internal vs external links
8. Monitor and report crawl progress

**Output**: 
- `site_crawl_YYYYMMDD_HHMMSS.json` - Complete crawl data
- `site_content_YYYYMMDD_HHMMSS.md` - Concatenated markdown content
- `site_pages_YYYYMMDD_HHMMSS/` - Individual page files
- Crawl summary report with statistics

### Bulk URL Validation
**Input**: File upload (TXT, CSV, Excel, JSON) containing URLs
**Process**:
1. Parse uploaded file and extract URLs
2. Validate URL format for each entry
3. Perform concurrent HTTP requests (configurable concurrency)
4. Check response status, headers, and accessibility
5. Measure response times and detect redirects
6. Update original file structure with status columns

**Output**: Enhanced file with additional columns:
- `status` - HTTP status code or error type
- `is_active` - Boolean (true/false)
- `response_time` - Request duration in milliseconds
- `final_url` - URL after redirects
- `content_type` - Detected MIME type
- `checked_at` - Timestamp of validation

### Content Processing Pipeline
**HTML to Markdown Conversion**:
- Preserve heading hierarchy (H1-H6)
- Convert links with proper formatting
- Handle images with alt text
- Maintain list structures (ordered/unordered)
- Preserve code blocks and inline code
- Clean up excessive whitespace

**Metadata Extraction**:
- Page title and meta description
- Open Graph and Twitter Card data
- Canonical URLs and language tags
- Word count and reading time estimation
- Image and link inventories

### Error Handling & Resilience
**Comprehensive Error Management**:
- Network timeout handling (configurable)
- Rate limiting compliance (respect 429 responses)
- Robot.txt compliance checking
- Broken link detection and categorization
- Memory usage monitoring and cleanup
- Graceful degradation for JavaScript-heavy sites

## API Endpoints Specification

### Core Crawler API
```
POST /api/crawl/start
- Body: { url, settings: { maxPages, maxDepth, delay, respectRobots } }
- Returns: { jobId, status: "started" }

GET /api/crawl/status/:jobId
- Returns: { status, progress, stats, errors }

GET /api/crawl/results/:jobId
- Query: ?format=json|markdown|mdx
- Returns: Crawled content in requested format

POST /api/validate/bulk
- Body: FormData with file upload
- Returns: { jobId, fileInfo, estimatedTime }

GET /api/validate/download/:jobId
- Returns: Updated file with validation results
```

## User Experience Requirements

### Dashboard Design
- **Clean, Modern Interface**: Minimal design with clear call-to-action buttons
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: WebSocket connections for live progress updates
- **Intuitive Navigation**: Clear sections for crawling, validation, and results
- **Error Communication**: User-friendly error messages with suggested fixes

### Performance Expectations
- **Fast Response**: Dashboard loads under 2 seconds
- **Efficient Crawling**: Process 10-50 pages per minute (depending on site)
- **Bulk Validation**: Handle 1000+ URLs with progress tracking
- **Memory Management**: Stable operation for extended crawling sessions
- **Concurrent Operations**: Support multiple users/crawl jobs

### File Export Features
**JSON Export Structure**:
```json
{
  "crawl_metadata": {
    "target_url": "https://example.com",
    "started_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:45:00Z",
    "total_pages": 45,
    "successful_crawls": 42,
    "failed_crawls": 3
  },
  "pages": [
    {
      "url": "https://example.com/page1",
      "title": "Page Title",
      "content": "Markdown content...",
      "metadata": { "word_count": 350, "images": 2 },
      "links": ["url1", "url2"],
      "crawled_at": "2024-01-15T10:31:15Z"
    }
  ],
  "errors": [
    {
      "url": "https://example.com/broken",
      "error_type": "404",
      "message": "Page not found"
    }
  ]
}
```

## Expected Development Deliverables

### Phase 1: Core Infrastructure (Week 1-2)
- Basic React dashboard with URL input
- Express.js backend with TypeScript
- Crawlee integration for basic crawling
- Simple progress tracking

### Phase 2: Advanced Crawling (Week 3-4)
- Content extraction and markdown conversion
- Export functionality (JSON, MD, MDX)
- Crawl statistics and error handling
- Basic bulk URL validation

### Phase 3: Enhanced Features (Week 5-6)
- File upload interface for bulk validation
- Enhanced dashboard with charts and analytics
- Advanced crawl settings and configuration
- Comprehensive error reporting

### Phase 4: Polish & Optimization (Week 7-8)
- Performance optimization and testing
- UI/UX improvements and responsive design
- Documentation and deployment setup
- Open source preparation

## Success Criteria

**Functional Requirements Met**:
- ✅ Single website crawling with content extraction
- ✅ Multiple export formats (JSON, MD, MDX)
- ✅ Bulk URL validation with file processing
- ✅ Real-time progress tracking and statistics
- ✅ Comprehensive error handling and reporting

**Performance Benchmarks**:
- Handle crawling of 100+ page websites
- Process 1000+ URL validation lists
- Dashboard response time under 2 seconds
- Stable memory usage during extended operations
- 99%+ uptime for crawler service

**User Experience Goals**:
- Intuitive interface requiring no documentation
- Clear feedback for all user actions
- Reliable download and export functionality
- Responsive design across all devices
- Professional, modern aesthetic

This specification provides a comprehensive foundation for building a production-ready, open-source web crawler application that meets all stated requirements while maintaining high code quality and user experience standards.