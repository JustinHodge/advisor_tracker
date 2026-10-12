export const getGPAClass = (gpa: number) => {
    if (gpa < 1) {
        return 'text-danger';
    }
    else if (gpa < 2) {
        return 'text-warning';
    }
    else if (gpa < 3) {
        return 'text-notice';
    }
    else {
        return 'text-success';
    }
}

export const getPriorityClass = (priority: number) => {
    if (priority > 75) {
        return 'text-danger';
    }
    else if (priority > 50) {
        return 'text-warning';
    }
    else if (priority > 25) {
        return 'text-notice';
    }
    else {
        return 'text-success';
    }
}

export const getRiskFlagClass = (riskFlag: string) => {
    const riskFlagMap: { [key: string]: string } = {
        'High': 'pill-danger',
        'Medium': 'pill-warning',
        'Low': 'pill-success'
    }

    return `pill ${riskFlagMap[riskFlag] ?? 'pill-notice'}`
}

export const getLastContactDateClass = (lastContactDate: string | null) => {

    const TODAY = new Date("2026-10-05");
    const lastContactAsDate = new Date(lastContactDate ?? '');
    const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

    if (!lastContactDate || isNaN(lastContactAsDate.getTime()) || lastContactAsDate.getTime() > TODAY.getTime()) {
        return 'pill pill-notice';
    }

    const delta = TODAY.getTime() - new Date(lastContactDate).getTime();

    if (delta < ONE_MONTH) {
        return 'pill pill-success';
    } else if (delta < ONE_MONTH * 2) {
        return 'pill pill-warning';
    } else {
        return 'pill pill-danger';
    }
}
