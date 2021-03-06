function sendNotification(text: string): void {
    if (!document.hidden || !('Notification' in window)) {
        return;
    }
    
    if (Notification.permission === 'granted') {
        new Notification(text);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(text);
            }
        });
    }
}

function setTitle(title: string) {
    const prevTitle = document.title;
    document.title = title;
    return () => document.title = prevTitle;
}

export {sendNotification, setTitle};