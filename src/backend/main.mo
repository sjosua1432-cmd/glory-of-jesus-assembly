import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  type PhoneNumber = Nat;
  type Email = Text;

  // Prayer Requests
  type Category = {
    #healing;
    #deliverance;
    #finances;
    #family;
    #marriage;
    #education;
    #career;
    #testimony;
    #thanksgiving;
    #forgiveness;
    #salvation;
    #wisdom;
    #guidance;
    #patience;
    #perseverance;
    #faith;
    #hope;
    #love;
    #peace;
    #joy;
    #other : Text;
  };

  type Status = {
    #submitted;
    #prayedFor;
    #answered;
  };

  type PrayerRequest = {
    id : Nat;
    name : Text;
    phone : ?PhoneNumber;
    email : ?Email;
    category : Category;
    message : Text;
    timestamp : Time.Time;
    status : Status;
  };

  module PrayerRequest {
    public func compareByTimestamp(request1 : PrayerRequest, request2 : PrayerRequest) : Order.Order {
      Int.compare(request1.timestamp, request2.timestamp);
    };
  };

  // Prayer Request Storage
  type PrayerRequestStore = {
    requests : Map.Map<Nat, PrayerRequest>;
    nextId : Nat;
  };

  var prayerRequestStore : PrayerRequestStore = {
    requests = Map.empty<Nat, PrayerRequest>();
    nextId = 1;
  };

  // User Profiles
  type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Public Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitPrayerRequest(
    name : Text,
    phone : ?PhoneNumber,
    email : ?Email,
    category : Category,
    message : Text,
  ) : async Nat {
    let id = prayerRequestStore.nextId;
    let prayerRequest : PrayerRequest = {
      id;
      name;
      phone;
      email;
      category;
      message;
      timestamp = Time.now();
      status = #submitted;
    };
    prayerRequestStore.requests.add(id, prayerRequest);
    prayerRequestStore := {
      requests = prayerRequestStore.requests;
      nextId = prayerRequestStore.nextId + 1;
    };
    id;
  };

  public query ({ caller }) func getAllPrayerRequests() : async [PrayerRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all prayer requests");
    };
    prayerRequestStore.requests.values().toArray().sort(PrayerRequest.compareByTimestamp);
  };

  public query ({ caller }) func getPrayerRequestsByCategory(category : Category) : async [PrayerRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view prayer requests by category");
    };
    prayerRequestStore.requests.values().toArray().filter(
      func(request) {
        request.category == category;
      }
    );
  };

  public shared ({ caller }) func updatePrayerRequestStatus(id : Nat, status : Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update prayer request status");
    };
    switch (prayerRequestStore.requests.get(id)) {
      case (null) { Runtime.trap("Prayer request not found") };
      case (?request) {
        let updatedRequest = { request with status };
        prayerRequestStore.requests.add(id, updatedRequest);
      };
    };
  };
};
