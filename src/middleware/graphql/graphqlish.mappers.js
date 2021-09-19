const { searchById } = require('../../services/base/base.service');
module.exports.getCurrentDate = () => {
  const today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth(),
    yyyy = today.getFullYear();
  return `${mm}:${dd}:${yyyy}`;
};

function mapCoding(c) {
  if (c) {
    return {
      id: c.id,
      system: c.system,
      version: c.version,
      code: c.code,
      display: c.display,
      userSelected: c.userSelected,
    };
  }
  return null;
}
function mapCodingList(codes) {
  const result = [];
  if (codes) {
    for (const c of codes) {
      result.push(mapCoding(c));
    }
  }
  return result;
}

function mapCodeableConcept(code) {
  if (code) {
    return {
      id: code.id,
      coding: mapCodingList(code.coding),
      text: code.text,
    };
  }
  return null;
}

function mapCodeableConceptList(codes) {
  const result = [];
  if (codes) {
    for (const code of codes) {
      result.push(mapCodeableConcept(code));
    }
  }
  return result;
}

function mapPeriod(period) {
  if (period) {
    return {
      id: period.id,
      start: period.start,
      end: period.end,
    };
  }
  return null;
}

function mapAddress(address) {
  if (address) {
    return {
      id: address.id,
      use: address.use,
      type: address.type,
      text: address.text,
      line: address.line,
      city: address.city,
      district: address.district,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      period: mapPeriod(address.period),
    };
  }
  return null;
}

function mapMeta(meta) {
  if (meta) {
    return {
      versionId: meta.versionId,
      lastUpdated: meta.lastUpdated,
      source: meta.source,
      security: mapCodingList(meta.security),
    };
  } else {
    return {};
  }
}

function mapNarrative(text) {
  if (text) {
    return {
      id: text.id,
      status: text.status,
      div: text.div,
    };
  }
  return null;
}
function mapReference(ref) {
  if (ref && ref.reference) {
    return { id: ref.reference };
  } else {
    return null;
  }
}
function mapIdentifier(id) {
  if (id) {
    return {
      id: id.id,
      use: id.use,
      type: mapCodeableConcept(id.type),
      system: id.system,
      value: id.value,
      period: mapPeriod(id.period),
      assigner: mapReference(id.assigner),
    };
  }
  return null;
}

function mapIdentifierList(ids) {
  const result = [];
  if (ids) {
    for (const id of ids) {
      result.push(mapIdentifier(id));
    }
  }
  return result;
}
function mapHumanName(human) {
  if (human) {
    return {
      id: human.id,
      use: human.use,
      text: human.text,
      family: human.family,
      given: human.given,
      prefix: human.prefix,
      suffix: human.suffix,
      period: mapPeriod(human.period),
    };
  }
  return null;
}
function mapHumanNameList(humans) {
  const result = [];
  if (humans) {
    for (const h of humans) {
      result.push(mapHumanName(h));
    }
  }
  return result;
}

function mapContactPoint(cp) {
  if (cp) {
    return {
      id: cp.id,
      system: cp.system,
      value: cp.value,
      use: cp.use,
      rank: cp.rank,
      period: mapPeriod(cp.period),
    };
  }
  return null;
}

function mapContactPointList(cps) {
  const result = [];
  if (cps) {
    for (const cp of cps) {
      result.push(mapContactPoint(cp));
    }
  }
  return result;
}

function mapAddressList(addresses) {
  const result = [];
  if (addresses) {
    for (const a of addresses) {
      result.push(mapAddress(a));
    }
  }
  return result;
}

function mapAttachment(attach) {
  if (attach) {
    return {
      id: attach.id,
      contentType: attach.contentType,
      language: attach.language,
      data: attach.data,
      url: attach.url,
      size: attach.size,
      hash: attach.hash,
      title: attach.title,
      creation: attach.creation,
    };
  }
  return null;
}

function mapAttachmentList(attachs) {
  const result = [];
  if (attachs) {
    for (const at of attachs) {
      result.push(mapAttachment(at));
    }
  }
  return result;
}

function mapReferenceList(refs) {
  if (!refs) {
    return null;
  }
  const result = [];
  for (const r of refs) {
    result.push(mapReference(r));
  }
  return result;
}
function mapPractitionerqualification(qual) {
  return {
    id: qual.id,
    identifier: mapIdentifierList(qual.identifier),
    code: mapCodeableConcept(qual.code),
    period: mapPeriod(qual.period),
    issuer: mapReference(qual.issuer),
  };
}

function mapPractitionerqualificationList(qauls) {
  const result = [];
  if (qauls) {
    for (const q of qauls) {
      result.push(mapPractitionerqualification(q));
    }
  }
  return result;
}

function mapPractitioner(ref, { req }) {
  const splitId = ref.split('/');
  const pid = splitId[splitId.length - 1];
  return (async () => {
    try {
      const promise = searchById(
        { id: pid, base_version: '4_0_0' },
        { req },
        'Practitioner',
        'Practitioner'
      );
      const data = await promise;
      if (data) {
        return {
          id: data.id,
          meta: mapMeta(data.meta),
          implicitRules: data.implicitRules,
          language: data.language,
          text: mapNarrative(data.text),
          identifier: mapIdentifierList(data.identifier),
          active: data.active,
          name: mapHumanNameList(data.name),
          telecom: mapContactPointList(data.telecom),
          address: mapAddressList(data.address),
          gender: data.gender,
          birthDate: data.birthDate,
          photo: mapAttachmentList(data.photo),
          qualification: mapPractitionerqualificationList(data.qualification),
          communication: mapCodeableConceptList(data.communication)
        };
      } else {
        return { id: pid };
      }
    } catch (err) {
      //eat the exception should be logged
      return { id: pid };
    }
  })();
}

function mapOrganization(ref) {
  const splitId = ref.split('/');
  const pid = splitId[splitId.length - 1];
  return { id: pid };
}

function resolveProvider(ref, { req }) {
  if (ref && ref.reference) {
    if (ref.reference.startsWith('Practitioner')) {
      return mapPractitioner(ref.reference, { req });
    } else if (ref.reference.startsWith('Organization')) {
      return mapOrganization(ref.reference);
    } else {
      return mapReference(ref);
    }
  }
  return null;
}

function convertStringArray(strs) {
  const result = [];
  if (strs) {
    for (const s of strs) {
      result.push(String(s));
    }
  }
  return result;
}

function convertNumberArray(nums) {
  const result = [];
  if (nums) {
    for (const n of nums) {
      result.push(Number(n));
    }
  }
  return result;
}

function mapQuantity(quantity) {
  if (quantity) {
    return {
      id: quantity.id,
      system: quantity.system,
      unit: quantity.unit,
      value: quantity.value,
      code: quantity.code,
      comparator: quantity.comparator,
    };
  }
  return null;
}

function mapMoney(price) {
  if (price) {
    return {
      id: price.id,
      value: price.value,
      currency: price.currency,
    };
  }
  return null;
}

function mapPeriodList(periods) {
  const result = [];
  if (periods) {
    for (const p of periods) {
      result.push(mapPeriod(p));
    }
  }
  return result;
}

function mapPayee(data) {
  if (data && data.payee) {
    return {
      type: mapCodeableConcept(data.payee.type),
    };
  }
  return null;
}

function mapAjudicationList(ads) {
  const result = [];
  if (ads) {
    for (const a of ads) {
      result.push({
        id: a.id,
        category: mapCodeableConcept(a.category),
        reason: mapCodeableConcept(a.reason),
        amount: mapMoney(a.amount),
        value: a.value,
      });
    }
  }
  return result;
}

function mapEOBSubDetailList(subDet) {
  const result = [];
  if (subDet) {
    for (const sub of subDet) {
      result.push({
        id: sub.id,
        sequence: sub.sequence,
        revenue: mapCodeableConcept(sub.revenue),
        category: mapCodeableConcept(sub.category),
        productOrService: mapCodeableConcept(sub.productOrService),
        modifier: mapCodeableConceptList(sub.modifier),
        programCode: mapCodeableConceptList(sub.programCode),
        quantity: mapQuantity(sub.quantity),
        unitPrice: mapMoney(sub.unitPrice),
        factor: sub.factor,
        net: mapMoney(sub.net),
        udi: mapReferenceList(sub.udi),
        noteNumber: sub.noteNumber,
      });
    }
  }
  return result;
}

function mapItemDetailList(details) {
  const result = [];
  if (details) {
    for (const det of details) {
      result.push({
        id: det.id,
        sequence: det.sequence,
        revenue: mapCodeableConcept(det.revenue),
        category: mapCodeableConcept(det.category),
        productOrService: mapCodeableConcept(det.productOrService),
        modifier: mapCodeableConceptList(det.modifier),
        programCode: mapCodeableConceptList(det.programCode),
        quantity: mapQuantity(det.quantity),
        unitPrice: mapMoney(det.unitPrice),
        factor: det.factor,
        net: mapMoney(det.net),
        udi: mapReferenceList(det.udi),
        noteNumber: det.noteNumber,
        subDetail: mapEOBSubDetailList(det.subDetail),
      });
    }
  }
  return result;
}

function getAmount(adjudications, codes) {
  var _a, _b;
  for (const code of codes) {
    const amt =
      (_b =
        (_a =
          adjudications === null || adjudications === void 0
            ? void 0
            : adjudications.find((adjudication) => {
                var _a1, _b1;
                return (_b1 =
                  (_a1 =
                    adjudication === null || adjudication === void 0
                      ? void 0
                      : adjudication.category) === null || _a1 === void 0
                    ? void 0
                    : _a1.coding) === null || _b1 === void 0
                  ? void 0
                  : _b1.find((obj) => {
                      //var _a2;
                      return (
                        ((_a1 = obj.code) === null || _a1 === void 0
                          ? void 0
                          : _a1.indexOf(code)) !== -1
                      );
                    });
              })) === null || _a === void 0
          ? void 0
          : _a.amount) === null || _b === void 0
        ? void 0
        : _b.value;
    if (amt) {
      return amt;
    }
  }
  return null;
}

function mapAmounts(ads, claimLines) {
  let result = {};
  if (ads) {
    result = {
      billed: getAmount(ads, ['submitted', 'paidtoprovider']),
      deductibleApplied: getAmount(ads, ['deductible']),
      allowed: getAmount(ads, ['eligible']),
      copay: getAmount(ads, ['copay']),
      coinsurance: getAmount(ads, ['coinsurance']),
      memberMayOwe: getAmount(ads, ['memberliability']),
      insurancePaid: getAmount(ads, ['paymentamount']),
    };
    result['memberPaid'] = result['copay'] + result['coinsurance'] + result['deductibleApplied'];
    if (result['insurancePaid'] === null) {
      let claimLineInsurancePaid;
      const claimLineInsurancePaids =
        claimLines === null || claimLines === void 0
          ? void 0
          : claimLines.map((claimLine) => {
              var _a;
              return (_a =
                claimLine === null || claimLine === void 0 ? void 0 : claimLine.amounts) === null ||
                _a === void 0
                ? void 0
                : _a.insurancePaid;
            });
      if (
        claimLineInsurancePaids === null || claimLineInsurancePaids === void 0
          ? void 0
          : claimLineInsurancePaids.length
      ) {
        claimLineInsurancePaid = claimLineInsurancePaids.reduce((a, b) => {
          return a + b;
        });
      }
      if (claimLineInsurancePaid !== null) {
        result['insurancePaid'] = claimLineInsurancePaid;
      } else if (result['allowed'] !== null && result['memberPaid'] !== null) {
        result['insurancePaid'] = result['allowed'] - result['memberPaid'];
      }
    }
  }
  return result;
}

function mapItem(data) {
  const result = [];
  if (data && data.item) {
    for (const i of data.item) {
      const item = {
        id: String(i.id),
        sequence: i.sequence,
        careTeamSequence: convertNumberArray(i.careTeamSequence),
        diagnosisSequence: convertNumberArray(i.diagnosisSequence),
        procedureSequence: convertNumberArray(i.procedureSequence),
        informationSequence: convertNumberArray(i.informationSequence),
        revenue: mapCodeableConcept(i.revenue),
        category: mapCodeableConcept(i.category),
        productOrService: mapCodeableConcept(i.productOrService),
        modifier: mapCodeableConceptList(i.modifier),
        programCode: mapCodeableConceptList(i.programCode),
        servicedDate: i.servicedDate,
        servicedPeriod: mapPeriod(i.servicedPeriod),
        locationCodeableConcept: mapCodeableConcept(i.locationCodeableConcept),
        locationAddress: mapAddress(i.locationAddress),
        locationReference: mapReference(i.locationReference),
        quantity: mapQuantity(i.quantity),
        unitPrice: mapMoney(i.unitPrice),
        factor: Number(i.factor),
        net: mapMoney(i.net),
        udi: mapReferenceList(i.udi),
        bodySite: mapCodeableConcept(i.bodySite),
        subSite: mapCodeableConceptList(i.subSite),
        encounter: mapReferenceList(i.encounter),
        noteNumber: convertNumberArray(i.noteNumber),
        adjudication: mapAjudicationList(i.adjudication),
        detail: mapItemDetailList(i.detail),
        amounts: mapAmounts(i.adjudication),
      };
      result.push(item);
    }
  }
  return result;
}

function mapEOBRelated(relate) {
  if (relate) {
    return {
      id: relate.id,
      claim: mapReference(relate.claim.reference),
      relationship: mapCodeableConcept(relate.relationship),
      reference: mapIdentifier(relate.reference),
    };
  }
  return null;
}

function mapEOPRelatedList(data) {
  const result = [];
  if (data && data.related) {
    for (const r of data.related) {
      result.push(mapEOBRelated(r));
    }
  }
  return result;
}

function mapCareTeam(data) {
  const result = [];
  if (data.careTeam) {
    for (const ct of data.careTeam) {
      result.push({
        id: String(ct.id),
        sequence: ct.sequence,
        provider: mapReference(ct.provider),
        responsible: Boolean(ct.responsible),
        role: mapCodeableConcept(ct.role),
        qualification: mapCodeableConcept(ct.qualification),
      });
    }
  }
  return result;
}

function mapEOBSupportingInfo(data) {
  const result = [];
  if (data.supportingInfo) {
    for (const si of data.supportingInfo) {
      result.push({
        id: String(si.id),
        sequence: si.sequence,
        category: mapCodeableConcept(si.category),
        code: mapCodeableConcept(si.code),
        timingDate: si.timingDate,
        timingPeriod: mapPeriod(si.timingPeriod),
        valueBoolean: Boolean(si.valueBoolean),
        valueString: String(si.valueString),
        valueQuantity: mapQuantity(si.valueQuantity),
        valueAttachment: mapAttachment(si.valueAttachment),
        valueReference: mapReference(si.valueReference),
        reason: mapCoding(si.reason),
      });
    }
  }
  return result;
}

function mapDiagnosis(data) {
  const result = [];
  if (data.diagnosis) {
    for (const d of data.diagnosis) {
      result.push({
        id: String(d.id),
        sequence: d.sequence,
        diagnosisCodeableConcept: mapCodeableConcept(d.diagnosisCodeableConcept),
        diagnosisReference: mapReference(d.diagnosisReference),
        type: mapCodeableConceptList(d.type),
        onAdmission: mapCodeableConcept(d.onAdmission),
        packageCode: mapCodeableConcept(d.packageCode),
      });
    }
  }
  return result;
}

function mapProcedure(data) {
  const result = [];
  if (data && data.procedure) {
    for (const p of data.procedure) {
      result.push({
        id: String(p.id),
        sequence: p.sequence,
        type: mapCodingList(p.type),
        date: p.date,
        procedureCodeableConcept: mapCodeableConcept(p.procedureCodeableConcept),
        procedureReference: mapReference(p.procedureReference),
        udi: mapReferenceList(p.udi),
      });
    }
  }
  return result;
}

function mapInsurance(data) {
  const result = [];
  if (data && data.insurance) {
    for (const i of data.insurance) {
      result.push({
        id: String(i.id),
        focal: Boolean(i.focal),
        coverage: mapReference(i.coverage.reference),
        preAuthRef: convertStringArray(i.preAuthRef),
      });
    }
  }
  return result;
}

function mapExplanationOfBenefititem(data) {
  if (data && data.accident) {
    return {
      id: String(data.accident.id),
      date: String(data.accident.date),
      type: mapCodeableConcept(data.accident.type),
      locationAddress: mapAddress(data.accident.locationAddress),
      locationReference: mapReference(data.accident.locationReference),
    };
  }
  return null;
}

function mapExplanationOfBenefitaddItemdetailsubDetail(sub) {
  if (sub) {
    return {
      id: sub.id,
      productOrService: mapCodeableConcept(sub.productOrService),
      modifier: mapCodeableConceptList(sub.modifier),
      quantity: mapQuantity(sub.quantity),
      unitPrice: mapMoney(sub.unitPrice),
      factor: sub.factor,
      net: mapMoney(sub.net),
      noteNumber: sub.noteNumber,
    };
  }
  return null;
}

function mapExplanationOfBenefitaddItemdetailsubDetailList(subDets) {
  const result = [];
  if (subDets) {
    for (const d in subDets) {
      result.push(mapExplanationOfBenefitaddItemdetailsubDetail(d));
    }
  }
  return result;
}

function mapExplanationOfBenefitaddItemdetail(detail) {
  if (detail) {
    return {
      id: detail.id,
      productOrService: mapCodeableConcept(detail.productOrService),
      modifier: mapCodeableConceptList(detail.modifier),
      quantity: mapQuantity(detail.quantity),
      unitPrice: mapMoney(detail.unitPrice),
      factor: detail.factor,
      net: mapMoney(detail.net),
      noteNumber: detail.noteNumber,
      subDetail: mapExplanationOfBenefitaddItemdetailsubDetailList(detail.subDetail),
    };
  }
  return null;
}

function mapExplanationOfBenefitaddItemdetailList(details) {
  const result = [];
  if (details) {
    for (const detail of details) {
      result.push(mapExplanationOfBenefitaddItemdetail(detail));
    }
  }
  return result;
}

function mapExplanationOfBenefitaddItem(item) {
  if (item) {
    return {
      id: item.id,
      itemSequence: item.itemSequence,
      detailSequence: item.detailSequence,
      subDetailSequence: item.subDetailSequence,
      provider: mapReferenceList(item.provider),
      productOrService: mapCodeableConcept(item.productOrService),
      modifier: mapCodeableConceptList(item.modifier),
      programCode: mapCodeableConceptList(item.programCode),
      servicedDate: item.serviceDate,
      servicedPeriod: mapPeriod(item.servicePeriod),
      locationCodeableConcept: mapCodeableConcept(item.locationCodeableConcept),
      locationAddress: mapAddress(item.locationAddress),
      locationReference: mapReference(item.locationReference),
      quantity: mapQuantity(item.quantity),
      unitPrice: mapMoney(item.unitPrice),
      factor: item.factor,
      net: mapMoney(item.net),
      bodySite: mapCodeableConcept(item.bodySite),
      noteNumber: item.noteNumber,
      detail: mapExplanationOfBenefitaddItemdetailList(item.detail),
    };
  }
  return null;
}

function mapExplanationOfBenefitaddItemList(data) {
  const result = [];
  if (data && data.addItem) {
    for (const i in data.addItem) {
      result.push(mapExplanationOfBenefitaddItem(i));
    }
  }
  return result;
}
function mapTotal(total) {
  if (total) {
    return {
      id: total.id,
      category: mapCodeableConcept(total.category),
      amount: mapMoney(total.amount),
    };
  }
  return null;
}

function mapTotalList(data) {
  if (data && data.total) {
    const result = [];
    for (const t of data.total) {
      result.push(mapTotal(t));
    }
    return result;
  }
  return null;
}

function mapExplanationOfBenefitpayment(data) {
  if (data && data.payment) {
    return {
      id: String(data.payment.id),
      type: mapCodeableConcept(data.payment.type),
      adjustment: mapMoney(data.payment.adjustment),
      adjustmentReason: mapCodeableConcept(data.payment.adjustmentReason),
      date: data.payment.date,
      amount: mapMoney(data.payment.amount),
      identifier: mapIdentifier(data.payment.identifier),
    };
  }
  return null;
}

function mapExplanationOfBenefitprocessNote(proc) {
  if (proc) {
    return {
      id: proc.id,
      number: proc.number,
      type: proc.type,
      text: proc.text,
      language: mapCodeableConcept(proc.language),
    };
  }
  return null;
}

function mapExplanationOfBenefitprocessNoteList(data) {
  if (data && data.processNote) {
    const proc = [];
    for (const p of data.processNote) {
      proc.push(mapExplanationOfBenefitprocessNote(p));
    }
    return proc;
  }
  return null;
}

function mapExplanationOfBenefitbenefitBalancefinancial(fin) {
  if (fin) {
    return {
      id: fin.id,
      type: mapCodeableConcept(fin.type),
      allowedUnsignedInt: fin.allowedUnsignedInt,
      allowedString: fin.allowedString,
      allowedMoney: mapMoney(fin.allowedMoney),
      usedUnsignedInt: fin.usedUnsignedInt,
      usedMoney: mapMoney(fin.usedMoney),
    };
  }
  return null;
}

function mapExplanationOfBenefitbenefitBalancefinancialList(fins) {
  const result = [];
  if (fins) {
    for (const f of fins) {
      result.push(mapExplanationOfBenefitbenefitBalancefinancial(f));
    }
  }
  return result;
}

function mapExplanationOfBenefitbenefitBalance(benBal) {
  if (benBal) {
    return {
      id: benBal.id,
      category: mapCodeableConcept(benBal.category),
      excluded: benBal.excluded,
      name: benBal.name,
      description: benBal.description,
      network: mapCodeableConcept(benBal.network),
      unit: mapCodeableConcept(benBal.unit),
      term: mapCodeableConcept(benBal.term),
      financial: mapExplanationOfBenefitbenefitBalancefinancialList(benBal.financial),
    };
  }
  return null;
}

function mapExplanationOfBenefitbenefitBalanceList(data) {
  const result = [];
  if (data && data.benefitBalance) {
    for (const b of data.benefitBalance) {
      result.push(mapExplanationOfBenefitbenefitBalance(b));
    }
  }
  return result;
}

module.exports.mapEOB = (data, { req }) => {
  const item = mapItem(data);
  return {
    resourceType: 'ExplanationOfBenefit',
    id: data.id,
    meta: mapMeta(data.meta),
    implicitRules: data.implicitRules,
    language: data.language,
    text: mapNarrative(data.text),
    identifier: mapIdentifierList(data.identifier),
    status: data.status,
    type: mapCodeableConcept(data.type),
    subType: mapCodeableConcept(data.subType),
    use: data.use,
    patient: mapReference(data.patient),
    billablePeriod: mapPeriod(data.billablePeriod),
    created: data.created,
    enterer: mapReference(data.enterer),
    insurer: mapReference(data.insurer),
    provider: resolveProvider(data.provider, { req }),
    priority: mapCodeableConcept(data.priority),
    fundsReserveRequested: mapCodeableConcept(data.fundsReserveRequested),
    fundsReserve: mapCodeableConcept(data.fundsReserve),
    related: mapEOPRelatedList(data),
    prescription: mapReference(data.prescription),
    originalPrescription: mapReference(data.originalPrescription),
    payee: mapPayee(data),
    referral: mapReference(data.referral),
    facility: mapReference(data.facility),
    claim: mapReference(data.claim),
    claimResponse: mapReference(data.claimResponse),
    outcome: data.outcome,
    disposition: String(data.disposition),
    preAuthRef: convertStringArray(data.preAuthRef),
    preAuthRefPeriod: mapPeriodList(data.preAuthRefPeriod),
    careTeam: mapCareTeam(data),
    supportingInfo: mapEOBSupportingInfo(data),
    diagnosis: mapDiagnosis(data),
    procedure: mapProcedure(data),
    precedence: data.precedence,
    insurance: mapInsurance(data),
    accident: mapExplanationOfBenefititem(data),
    addItem: mapExplanationOfBenefitaddItemList(data),
    total: mapTotalList(data),
    payment: mapExplanationOfBenefitpayment(data),
    formCode: mapCodeableConcept(data.formCode),
    form: mapAttachment(data.form),
    processNote: mapExplanationOfBenefitprocessNoteList(data),
    benefitPeriod: mapPeriod(data.benefitPeriod),
    benefitBalance: mapExplanationOfBenefitbenefitBalanceList(data),
    item: item,
    amounts: mapAmounts(data.total, item),
  };
};
