import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {TNSOTPublisher} from './publisher';
import {TNSOTSubscriber} from './subscriber';

declare var OTSession: any,
    OTSessionDelegate: any,
    interop: any,
    OTSessionErrorCode: any;

export class TNSOTSession extends NSObject {

    public static ObjCProtocols = [OTSessionDelegate];

    public _ios: any;

    private _events: Observable;
    private _subscriber: TNSOTSubscriber;

    public static initWithApiKeySessionId(apiKey: string, sessionId: string): TNSOTSession {
        let instance = <TNSOTSession>TNSOTSession.new();
        instance._events = new Observable();
        instance._ios = OTSession.alloc().initWithApiKeySessionIdDelegate(apiKey.toString(), sessionId.toString(), instance);
        return instance;
    }

    connect(token: string): void {
        let errorRef = new interop.Reference();
        this._ios.connectWithTokenError(token, errorRef);
        if (errorRef.value) {
            console.log(errorRef.value);
        }
    }

    disconnect(): void {
        if (this._ios) {
            try {
                let errorRef = new interop.Reference();
                this._ios.disconnect(errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    unsubscribe(subscriber: any): void {
        try {
            if (this._ios) {
                let errorRef = new interop.Reference();
                this._ios.unsubscribe(subscriber, errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    set subscriber(subscriber) {
        this._subscriber = subscriber;
    }

    get events(): Observable {
        return this._events;
    }

    sessionDidConnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidConnect',
                object: new Observable({
                    session: session
                })
            });
        }
    }

    sessionDidDisconnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidDisconnect',
                object: new Observable({
                    session: session
                })
            });
        }
    }

    sessionDidReconnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidReconnect',
                object: new Observable({
                    session: session
                })
            });
        }
    }

    sessionDidBeginReconnecting(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidBeginReconnecting',
                object: new Observable({
                    session: session
                })
            });
        }
    }

    sessionStreamCreated(session: any, stream: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'streamCreated',
                object: new Observable({
                    session: session,
                    stream: stream
                })
            });
        }
        if (this._subscriber) {
            this._subscriber.subscribe(session, stream);
        }
    }

    sessionStreamDestroyed(session: any, stream: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'streamDestroyed',
                object: new Observable({
                    session: session,
                    stream: stream
                })
            });
        }
    }

    sessionDidFailWithError(session: any, error: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    session: session,
                    error: error
                })
            });
        }
    }

    sessionConnectionDestroyed(session: any, connection: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'connectionDestroyed',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionConnectionCreated(session: any, connection: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'connectionCreated',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionArchiveStartedWithId(session: any, archiveId: string, name?: string) {
        if (this.events) {
            this.events.notify({
                eventName: 'archiveStartedWithId',
                object: new Observable({
                    session: session,
                    archiveId: archiveId,
                    name: name
                })
            });
        }
    }

    sessionArchiveStoppedWithId(session: any, archiveId: string) {
        if (this.events) {
            this.events.notify({
                eventName: 'archiveStoppedWithId',
                object: new Observable({
                    session: session,
                    archiveId: archiveId
                })
            });
        }
    }

}
