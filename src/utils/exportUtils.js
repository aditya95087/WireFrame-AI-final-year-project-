import html2pdf from 'html2pdf.js';

// Helpers to handle backward-compatible rendering (String vs Array)
const renderStackDataHtml = (data) => {
    if (!data) return '--';
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
        return data.map(item => `<strong>${item.name}</strong> ${item.isBest ? '<span style="color: green; font-size: 10px;">(Best Choice)</span>' : ''}<br/><span style="font-size: 11px; color: #555">${item.reason || ''}</span>`).join('<br/><br/>');
    }
    return '--';
};

const renderDataModelHtml = (model) => {
    if (!model) return '--';
    if (typeof model === 'string') return model;
    if (Array.isArray(model)) {
        return model.map(m => `<b>${m.entity}</b>: ${m.attributes}`).join('<br/>');
    }
    return '--';
};

const renderStackDataMd = (data) => {
    if (!data) return '--';
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
        return data.map(item => `**${item.name}** ${item.isBest ? '(Best Choice)' : ''} - *${item.reason || ''}*`).join(', ');
    }
    return '--';
};

const renderDataModelMd = (model) => {
    if (!model) return '--';
    if (typeof model === 'string') return model;
    if (Array.isArray(model)) {
        return model.map(m => `- **${m.entity}**: ${m.attributes}`).join('\n');
    }
    return '--';
};

// Reusable function to generate the styled HTML string
const generateDocumentHTML = (data) => {
    const { concept, workshop, techSpec, documentation, algorithms, projectPhases } = data;

    return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 10px;">${concept?.title || 'Project Blueprint'}</h1>
        <p style="font-size: 1.2em; color: #555;"><em>${concept?.description || ''}</em></p>
        
        ${workshop ? `
        <h2 style="color: #6366f1; border-bottom: 1px solid #ccc; margin-top: 30px;">1. Research & Overview</h2>
        <h3>Idea Overview</h3>
        <p>${workshop.ideaOverview || workshop.overview || '--'}</p>
        <h3>Research Summary</h3>
        <p>${workshop.researchSummary || '--'}</p>
        <h3>Strategic Action Plan</h3>
        <ul>
          ${(workshop.actionPlan || []).map(step => `<li>${step}</li>`).join('')}
        </ul>
        <p><strong>Recommendation:</strong> ${workshop.finalRecommendation}</p>
        ` : ''}

        ${techSpec ? `
        <h2 style="color: #6366f1; border-bottom: 1px solid #ccc; margin-top: 30px;">2. Technical Specification</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 25%; vertical-align: top;">Frontend</td><td style="padding: 8px; border: 1px solid #ddd;">${renderStackDataHtml(techSpec.frontend)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Backend</td><td style="padding: 8px; border: 1px solid #ddd;">${renderStackDataHtml(techSpec.backend)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Database</td><td style="padding: 8px; border: 1px solid #ddd;">${renderStackDataHtml(techSpec.database)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Security & Auth</td><td style="padding: 8px; border: 1px solid #ddd;">${renderStackDataHtml(techSpec.auth)}</td></tr>
        </table>
        
        <h3>Database Design & Data Model</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #eee; font-family: monospace; font-size: 14px; line-height: 1.5;">
            ${renderDataModelHtml(techSpec.dataModel)}
        </div>
        ` : ''}

        ${algorithms && algorithms.length > 0 ? `
        <h2 style="color: #6366f1; border-bottom: 1px solid #ccc; margin-top: 30px;">3. Core Algorithms</h2>
        ${algorithms.map(algo => `
            <div style="margin-bottom: 15px;">
                <h4 style="margin-bottom: 5px;">${algo.name} <span style="background: #e2e8f0; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${algo.complexity}</span></h4>
                <p style="margin-top: 0; color: #555;">${algo.description}</p>
            </div>
        `).join('')}
        ` : ''}

        ${projectPhases ? `
        <h2 style="color: #6366f1; border-bottom: 1px solid #ccc; margin-top: 30px;">4. Project Phases</h2>
        ${Object.values(projectPhases).map(phase => `
            <div style="margin-bottom: 15px;">
                <h4 style="margin-bottom: 5px;">${phase.title}</h4>
                <p style="margin: 0; color: #444;"><strong>Desc:</strong> ${phase.description}</p>
                <p style="margin: 0; color: #444;"><strong>Deliverables:</strong> ${phase.deliverables}</p>
            </div>
        `).join('')}
        ` : ''}

        ${documentation ? `
        <h2 style="color: #6366f1; border-bottom: 1px solid #ccc; margin-top: 30px;">5. System Documentation</h2>
        <h3>Executive Summary</h3>
        <p>${documentation.executiveSummary || '--'}</p>
        <h3>System Architecture</h3>
        <p>${documentation.systemArchitecture || '--'}</p>
        <h3>Testing Strategy</h3>
        <p>${documentation.testingStrategy || '--'}</p>
        <h3>Deployment Guide</h3>
        <p>${documentation.deploymentGuide || '--'}</p>
        ` : ''}

        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
        <p style="text-align: center; color: #999; font-size: 12px;">Document Generated by Idea Wireframe PWA</p>
      </div>
    `;
};


export const downloadPDF = (data) => {
    const htmlString = generateDocumentHTML(data);
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // Hide it visually while processing
    document.body.appendChild(container);

    const opt = {
        margin:       10,
        filename:     `${(data.concept?.title || 'project').replace(/\s+/g, '_').toLowerCase()}_workspace.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
    }).catch(err => {
        console.error("PDF generation failed", err);
        document.body.removeChild(container);
    });
};


export const downloadWord = (data) => {
    const htmlString = generateDocumentHTML(data);
    
    // Add Office XML namespace headers for MS Word formatting parsing
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Docs</title></head><body>";
    const postHtml = "</body></html>";
    const finalHtml = preHtml + htmlString + postHtml;

    // Convert HTML string to a Blob that Microsoft Word understands as text/html with a .doc extension
    const blob = new Blob(['\ufeff', finalHtml], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(data.concept?.title || 'project').replace(/\s+/g, '_').toLowerCase()}_workspace.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


export const downloadMarkdown = (data) => {
    const { concept, techSpec, documentation, algorithms, projectPhases } = data;

    const markdownContent = `
# ${concept?.title || 'Project'}
> ${concept?.description || ''}

---

## 1. Executive Summary
${documentation?.executiveSummary || '--'}

## 2. System Architecture
${documentation?.systemArchitecture || '--'}

## 3. Technical Specification
### Stack Recommendation
- **Frontend**: ${renderStackDataMd(techSpec?.frontend)}
- **Backend**: ${renderStackDataMd(techSpec?.backend)}
- **Database**: ${renderStackDataMd(techSpec?.database)}
- **Auth**: ${renderStackDataMd(techSpec?.auth)}

### Database Design & Data Model
${renderDataModelMd(techSpec?.dataModel)}

## 4. Algorithms
${(algorithms || []).map(algo => `### ${algo.name} (${algo.complexity})\n${algo.description}`).join('\n\n')}

## 5. Development Roadmap
${(documentation?.developmentRoadmap || []).map(phase => `### ${phase.phase}\n${phase.steps.map(step => `- ${step}`).join('\n')}`).join('\n\n')}

## 6. Project Phases (SDLC)
${(projectPhases ? Object.values(projectPhases) : []).map(phase => `### ${phase.title}\n- **Description**: ${phase.description}\n- **Deliverables**: ${phase.deliverables}`).join('\n\n')}

## 7. Testing Strategy
${documentation?.testingStrategy || '--'}

## 8. Deployment Guide
${documentation?.deploymentGuide || '--'}

---
*Generated by Idea Wireframe PWA*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(concept?.title || 'project').replace(/\s+/g, '_').toLowerCase()}_workspace.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Deprecated backwards compat export
export const downloadProjectData = downloadMarkdown;
